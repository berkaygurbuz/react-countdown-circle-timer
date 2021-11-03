import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Text, Animated, StyleSheet, View, Pressable } from 'react-native'
import { countdownCircleTimerProps } from '@countdown-circle-timer/shared'

const timeStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
}

const styles = StyleSheet.create({
  time: timeStyle,
  ariaTime: { height: 0, opacity: 0 },
})

const TimeWrapper = (props) => {
  const {
    children,
    animatedElapsedTime,
    duration,
    renderAriaTime,
    animatedColor,
  } = props

  const [timeProps, setTimeProps] = useState({
    remainingTime: duration,
    elapsedTime: 0,
    animatedColor,
  })

  useEffect(() => {
    const animatedListenerId = animatedElapsedTime.addListener(({ value }) => {
      const elapsedTime = value / 1000
      setTimeProps({
        remainingTime: Math.ceil(duration-elapsedTime),
        elapsedTime,
        animatedColor,
      })
    })

    return () => {
      animatedElapsedTime.removeListener(animatedListenerId)
    }
  }, [animatedElapsedTime, animatedColor, duration])

  return (
    <>
      {children !== null && (
        <Animated.View
          accessibilityElementsHidden={true}
          importantForAccessibility="no-hide-descendants"
          style={styles.time}
        >
          {React.isValidElement(children)
            ? React.cloneElement(React.Children.only(children), timeProps)
            : children(timeProps)}
        </Animated.View>
      )}
      {typeof renderAriaTime === 'function' && (
        <Text
          accessibilityRole="timer"
          accessibilityLiveRegion="assertive"
          importantForAccessibility="yes"
          style={styles.ariaTime}
        >
          {renderAriaTime(timeProps)}
        </Text>
      )}
    </>
  )
}

TimeWrapper.propTypes = {
  duration: PropTypes.number.isRequired,
  animatedElapsedTime: PropTypes.object.isRequired,
  // when there is a single color we just past the color string
  // when there are more colors it is an interpolate object
  animatedColor: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  children: countdownCircleTimerProps.children,
  renderAriaTime: countdownCircleTimerProps.renderAriaTime,
}

export { TimeWrapper }
