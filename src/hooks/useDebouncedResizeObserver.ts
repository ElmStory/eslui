import { useState, useMemo } from 'react'
import _ from 'lodash-es'

import useResizeObserver from 'use-resize-observer'

const useDebouncedResizeObserver = (wait: number) => {
  const [size, setSize] = useState<{
      width: number | undefined
      height: number | undefined
    }>({ width: undefined, height: undefined }),
    onResize = useMemo(() => _.debounce(setSize, wait, { leading: true }), [
      wait
    ]),
    { ref } = useResizeObserver({ onResize })

  return { ref, ...size }
}

export default useDebouncedResizeObserver
