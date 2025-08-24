import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '../../constants/theme';

const { width: screenWidth } = Dimensions.get('window');

interface ImageCarouselProps {
  images: string[];
  height?: number;
  showIndicators?: boolean;
  showNavigation?: boolean;
  borderRadius?: number;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  height = 200,
  showIndicators = true,
  showNavigation = true,
  borderRadius = BorderRadius.lg,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageWidth, setImageWidth] = useState(screenWidth - (Spacing.md * 2));
  const scrollViewRef = useRef<ScrollView>(null);

  const handleLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setImageWidth(width);
  };

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / imageWidth);
    setCurrentIndex(index);
  };

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * imageWidth,
        animated: true,
      });
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      scrollViewRef.current?.scrollTo({
        x: prevIndex * imageWidth,
        animated: true,
      });
    }
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
    scrollViewRef.current?.scrollTo({
      x: index * imageWidth,
      animated: true,
    });
  };

  if (!images || images.length === 0) {
    return (
      <View style={[styles.container, { height }]} onLayout={handleLayout}>
        <Image
          source={{ uri: 'https://via.placeholder.com/300x200' }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]} onLayout={handleLayout}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollView}
      >
        {images.map((imageUri, index) => (
          <Image
            key={index}
            source={{ uri: imageUri }}
            style={[
              styles.image,
              { width: imageWidth }
            ]}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {/* Navigation arrows */}
      {showNavigation && images.length > 1 && (
        <>
          {currentIndex > 0 && (
            <TouchableOpacity
              style={[styles.navButton, styles.prevButton]}
              onPress={goToPrevious}
              activeOpacity={0.8}
            >
              <Ionicons name="chevron-back" size={20} color={Colors.white} />
            </TouchableOpacity>
          )}
          
          {currentIndex < images.length - 1 && (
            <TouchableOpacity
              style={[styles.navButton, styles.nextButton]}
              onPress={goToNext}
              activeOpacity={0.8}
            >
              <Ionicons name="chevron-forward" size={20} color={Colors.white} />
            </TouchableOpacity>
          )}
        </>
      )}

      {/* Indicators */}
      {showIndicators && images.length > 1 && (
        <View style={styles.indicatorContainer}>
          {images.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.indicator,
                {
                  backgroundColor: index === currentIndex 
                    ? Colors.white 
                    : 'rgba(255, 255, 255, 0.5)',
                },
              ]}
              onPress={() => goToIndex(index)}
              activeOpacity={0.8}
            />
          ))}
        </View>
      )}

      {/* Image counter */}
      {images.length > 1 && (
        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>
            {currentIndex + 1}/{images.length}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }],
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: Spacing.sm,
    borderRadius: BorderRadius.full,
    zIndex: 2,
  },
  prevButton: {
    left: Spacing.sm,
  },
  nextButton: {
    right: Spacing.sm,
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: Spacing.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    marginHorizontal: 4,
  },
  counterContainer: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  counterText: {
    color: Colors.white,
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
  },
});
