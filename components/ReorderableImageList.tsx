import React, { useRef, useState, useLayoutEffect } from 'react';
import { View, ScrollView, Image, Text, TouchableOpacity, StyleSheet, Animated, PanResponder, LayoutRectangle } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface Props {
    images: string[];
    selectedIndex: number;
    onSelect: (index: number) => void;
    onRemove: (index: number) => void;
    onAdd: () => void;
    onReorder: (from: number, to: number) => void;
    // ドラッグ中は親の縦スクロールを止めるために通知する
    onDraggingChange: (isDragging: boolean) => void;
}

const ITEM_MARGIN = 16;

// 長押ししてからドラッグで並べ替えられる画像リスト
export default function ReorderableImageList({
    images,
    selectedIndex,
    onSelect,
    onRemove,
    onAdd,
    onReorder,
    onDraggingChange,
}: Props) {
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

    const layouts = useRef<LayoutRectangle[]>([]);
    const offsets = useRef<Animated.Value[]>([]);
    const dragX = useRef(new Animated.Value(0)).current;
    const dragScale = useRef(new Animated.Value(1)).current;
    const draggingRef = useRef<number | null>(null);
    const targetRef = useRef<number | null>(null);
    const isPanningRef = useRef(false);
    const hasDroppedRef = useRef(false);

    // 画像数に合わせて各アイテムのずらし量を用意
    while (offsets.current.length < images.length) {
        offsets.current.push(new Animated.Value(0));
    }

    // 並べ替えが反映されたら、ずらしていた位置を元に戻す
    useLayoutEffect(() => {
        if (!hasDroppedRef.current) return;
        hasDroppedRef.current = false;
        offsets.current.forEach((v) => v.setValue(0));
        dragX.setValue(0);
    }, [images, dragX]);

    // ドラッグ中のアイテムの中心がどの位置に来たか
    const getTargetIndex = (from: number, dx: number) => {
        const self = layouts.current[from];
        if (!self) return from;
        const center = self.x + self.width / 2 + dx;
        let target = 0;
        // 削除済みの画像の位置が残っていても数えないよう、現在の枚数分だけ見る
        layouts.current.slice(0, images.length).forEach((l, i) => {
            if (i !== from && l && l.x + l.width / 2 < center) target++;
        });
        return target;
    };

    // ドラッグ中のアイテムが抜けた分、間のアイテムを詰める
    const shiftOthers = (from: number, target: number) => {
        const self = layouts.current[from];
        if (!self) return;
        const space = self.width + ITEM_MARGIN;
        offsets.current.forEach((v, i) => {
            if (i === from) return;
            let toValue = 0;
            if (from < target && i > from && i <= target) toValue = -space;
            if (target < from && i >= target && i < from) toValue = space;
            Animated.timing(v, { toValue, duration: 150, useNativeDriver: false }).start();
        });
    };

    const startDrag = (index: number) => {
        draggingRef.current = index;
        targetRef.current = index;
        setDraggingIndex(index);
        onDraggingChange(true);
        Animated.spring(dragScale, { toValue: 1.1, useNativeDriver: false }).start();
    };

    const endDrag = () => {
        if (draggingRef.current === null) {
            isPanningRef.current = false;
            return;
        }
        const from = draggingRef.current;
        const to = targetRef.current;
        draggingRef.current = null;
        targetRef.current = null;
        isPanningRef.current = false;
        setDraggingIndex(null);
        onDraggingChange(false);
        Animated.spring(dragScale, { toValue: 1, useNativeDriver: false }).start();

        if (to === null || from === to) {
            dragX.setValue(0);
            return;
        }
        hasDroppedRef.current = true;
        onReorder(from, to);
    };

    const handleMove = (dx: number) => {
        const from = draggingRef.current;
        if (from === null) return;
        dragX.setValue(dx);
        const target = getTargetIndex(from, dx);
        if (target !== targetRef.current) {
            targetRef.current = target;
            shiftOthers(from, target);
        }
    };

    // PanResponderは一度しか作らないので、最新の関数をrefから呼ぶ
    const handlersRef = useRef({ handleMove, endDrag });
    handlersRef.current = { handleMove, endDrag };

    const panResponder = useRef(
        PanResponder.create({
            // 長押しでドラッグが始まっている時だけ、指の動きを奪う
            onMoveShouldSetPanResponderCapture: () => draggingRef.current !== null,
            onPanResponderGrant: () => {
                isPanningRef.current = true;
            },
            onPanResponderMove: (_, gesture) => handlersRef.current.handleMove(gesture.dx),
            onPanResponderRelease: () => handlersRef.current.endDrag(),
            onPanResponderTerminate: () => handlersRef.current.endDrag(),
            onPanResponderTerminationRequest: () => false,
        })
    ).current;

    return (
        <View {...panResponder.panHandlers}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                scrollEnabled={draggingIndex === null}
                style={styles.imageList}
                contentContainerStyle={styles.imageListContent}
            >
                {images.map((img, index) => {
                    const isDragging = draggingIndex === index;
                    return (
                        <Animated.View
                            key={index}
                            onLayout={(e) => {
                                layouts.current[index] = e.nativeEvent.layout;
                            }}
                            style={[
                                styles.itemWrapper,
                                isDragging && styles.itemDragging,
                                {
                                    transform: [
                                        { translateX: isDragging ? dragX : offsets.current[index] },
                                        { scale: isDragging ? dragScale : 1 },
                                    ],
                                },
                            ]}
                        >
                            <TouchableOpacity
                                style={[
                                    styles.imageItem,
                                    selectedIndex === index && styles.imageItemSelectedActive,
                                ]}
                                onPress={() => onSelect(index)}
                                onLongPress={() => startDrag(index)}
                                onPressOut={() => {
                                    // 長押し後に動かさず指を離した場合はここで終了する。
                                    // 指を動かした場合もドラッグ側に移る直前にここが呼ばれるので、
                                    // ドラッグが始まったかを確かめてから判断する
                                    setTimeout(() => {
                                        if (draggingRef.current !== null && !isPanningRef.current) {
                                            handlersRef.current.endDrag();
                                        }
                                    }, 0);
                                }}
                                delayLongPress={300}
                                activeOpacity={0.8}
                            >
                                <Image source={{ uri: img }} style={styles.thumbnail} />
                                <TouchableOpacity
                                    style={styles.deleteButtonSmall}
                                    onPress={() => onRemove(index)}
                                >
                                    <Feather name="x" size={12} color="#fff" />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        </Animated.View>
                    );
                })}
                {/* 追加ボタン */}
                <TouchableOpacity
                    style={styles.addImageButton}
                    onPress={onAdd}
                    activeOpacity={0.7}
                >
                    <Feather name="plus" size={24} color="#007AFF" />
                </TouchableOpacity>
                {images.length === 0 && (
                    <Text style={styles.emptyHint}>
                        画像を追加すると{'\n'}各SNSでの見え方を確認できます
                    </Text>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    imageList: {
        marginTop: 12,
    },
    imageListContent: {
        paddingRight: 20,
        paddingTop: 10,
    },
    itemWrapper: {
        marginRight: ITEM_MARGIN,
    },
    itemDragging: {
        zIndex: 10,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    imageItem: {
        position: 'relative',
        borderRadius: 18,
        backgroundColor: '#fff',
        padding: 3,
        borderWidth: 2,
        borderColor: '#e0e0e0',
    },
    imageItemSelectedActive: {
        borderWidth: 3,
        borderColor: '#007AFF',
    },
    thumbnail: {
        width: 80,
        height: 80,
        borderRadius: 15,
        backgroundColor: '#f0f0f0',
    },
    emptyHint: {
        alignSelf: 'center',
        marginLeft: 14,
        fontSize: 13,
        lineHeight: 20,
        color: '#666',
    },
    addImageButton: {
        width: 80,
        height: 80,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#d0d0d0',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fafafa',
    },
    deleteButtonSmall: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: 'rgba(255, 59, 48, 0.9)',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
});
