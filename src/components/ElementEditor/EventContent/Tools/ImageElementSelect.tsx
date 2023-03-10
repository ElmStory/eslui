import { ipcRenderer } from 'electron'

import { getSvgUrl } from '../../../../lib'

import React, { useCallback, useEffect, useRef, useState } from 'react'

import { WINDOW_EVENT_TYPE } from '../../../../lib/events'
import { StudioId, WorldId } from '../../../../data/types'
import { ImageElement } from '../../../../data/eventContentTypes'

import { ReactEditor, useSelected, useSlate } from 'slate-react'

import ImportAndCropImage, { CroppedImage } from '../../../ImportAndCropImage'

import styles from './styles.module.less'
import { Transforms } from 'slate'
import { Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { getElement } from '../../../../lib/contentEditor'

export type OnImageSelect = (image: CroppedImage) => Promise<void>

export const ImageSelectPlaceholder = `
<svg
  width="100%"
  height="100%"
  viewBox="0 0 655 368"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M42.3878 342.831L42.6465 340.848C43.4159 340.948 44.2014 341 45 341H48.0051V343H45C44.1147 343 43.2428 342.942 42.3878 342.831ZM606.995 343V341H610C610.799 341 611.584 340.948 612.354 340.848L612.612 342.831C611.757 342.942 610.885 343 610 343H606.995ZM617.656 341.482L616.89 339.635C618.352 339.029 619.718 338.234 620.957 337.282L622.176 338.868C620.799 339.926 619.282 340.808 617.656 341.482ZM625.868 335.176L624.282 333.957C625.234 332.718 626.029 331.352 626.635 329.89L628.482 330.656C627.808 332.282 626.926 333.799 625.868 335.176ZM630 48.0217H628V45C628 44.2014 627.948 43.4159 627.848 42.6465L629.831 42.3878C629.942 43.2428 630 44.1147 630 45V48.0217ZM628.482 37.3442L626.635 38.1104C626.029 36.6481 625.234 35.2822 624.282 34.043L625.868 32.8243C626.926 34.2006 627.808 35.7183 628.482 37.3442ZM622.176 29.132L620.957 30.7179C619.718 29.7655 618.352 28.9714 616.89 28.3651L617.656 26.5176C619.282 27.1919 620.799 28.0744 622.176 29.132ZM48.0053 25H45C44.1147 25 43.2428 25.0575 42.3878 25.169L42.6465 27.1522C43.4159 27.0519 44.2014 27 45 27H48.0053V25ZM37.3442 26.5176L38.1104 28.3651C36.6481 28.9714 35.2822 29.7655 34.043 30.7179L32.8243 29.132C34.2006 28.0744 35.7183 27.1919 37.3442 26.5176ZM29.132 32.8243L30.7179 34.043C29.7655 35.2822 28.9714 36.6481 28.3651 38.1104L26.5176 37.3442C27.1919 35.7183 28.0744 34.2006 29.132 32.8243ZM25 319.978H27V323C27 323.799 27.0519 324.584 27.1522 325.353L25.169 325.612C25.0575 324.757 25 323.885 25 323V319.978ZM26.5176 330.656L28.3651 329.89C28.9714 331.352 29.7655 332.718 30.7179 333.957L29.132 335.176C28.0744 333.799 27.1919 332.282 26.5176 330.656ZM37.3443 341.482L38.1104 339.635C36.6481 339.029 35.2822 338.234 34.043 337.282L32.8243 338.868C34.2006 339.926 35.7183 340.808 37.3443 341.482ZM25 313.935H27V307.891H25V313.935ZM25 301.848H27V295.804H25V301.848ZM25 289.761H27V283.717H25V289.761ZM25 277.674H27V271.63H25V277.674ZM25 265.587H27V259.543H25V265.587ZM25 253.5H27V247.457H25V253.5ZM25 241.413H27V235.37H25V241.413ZM25 229.326H27V223.283H25V229.326ZM25 217.239H27V211.196H25V217.239ZM25 205.152H27V199.109H25V205.152ZM25 193.065H27V187.022H25V193.065ZM25 180.978H27V174.935H25V180.978ZM25 168.891H27V162.848H25V168.891ZM25 156.804H27V150.761H25V156.804ZM25 144.717H27V138.674H25V144.717ZM25 132.63H27V126.587H25V132.63ZM25 120.544H27V114.5H25V120.544ZM25 108.457H27V102.413H25V108.457ZM25 96.3697H27V90.3262H25V96.3697ZM25 84.2827H27V78.2392H25V84.2827ZM25 72.1958H27V66.1523H25V72.1958ZM25 60.1088H27V54.0653H25V60.1088ZM25 48.0218H27V45C27 44.2014 27.0519 43.4159 27.1522 42.6465L25.169 42.3878C25.0575 43.2428 25 44.1147 25 45V48.0218ZM54.016 25V27H60.0266V25H54.016ZM66.0372 25V27H72.0479V25H66.0372ZM78.0585 25V27H84.0691V25H78.0585ZM90.0798 25V27H96.0904V25H90.0798ZM102.101 25V27H108.112V25H102.101ZM114.122 25V27H120.133V25H114.122ZM126.144 25V27H132.154V25H126.144ZM138.165 25V27H144.176V25H138.165ZM150.186 25V27H156.197V25H150.186ZM162.207 25V27H168.218V25H162.207ZM174.229 25V27H180.239V25H174.229ZM186.25 25V27H192.261V25H186.25ZM198.271 25V27H204.282V25H198.271ZM210.293 25V27H216.303V25H210.293ZM222.314 25V27H228.324V25H222.314ZM234.335 25V27H240.346V25H234.335ZM246.356 25V27H252.367V25H246.356ZM258.378 25V27H264.388V25H258.378ZM270.399 25V27H276.41V25H270.399ZM282.42 25V27H288.431V25H282.42ZM294.441 25V27H300.452V25H294.441ZM306.463 25V27H312.473V25H306.463ZM318.484 25V27H324.495V25H318.484ZM330.505 25V27H336.516V25H330.505ZM342.527 25V27H348.537V25H342.527ZM354.548 25V27H360.559V25H354.548ZM366.569 25V27H372.58V25H366.569ZM378.59 25V27H384.601V25H378.59ZM390.612 25V27H396.622V25H390.612ZM402.633 25V27H408.644V25H402.633ZM414.654 25V27H420.665V25H414.654ZM426.676 25V27H432.686V25H426.676ZM438.697 25V27H444.708V25H438.697ZM450.718 25V27H456.729V25H450.718ZM462.74 25V27H468.75V25H462.74ZM474.761 25V27H480.772V25H474.761ZM486.782 25V27H492.793V25H486.782ZM498.803 25V27H504.814V25H498.803ZM510.825 25V27H516.835V25H510.825ZM522.846 25V27H528.857V25H522.846ZM534.867 25V27H540.878V25H534.867ZM546.889 25V27H552.899V25H546.889ZM558.91 25V27H564.921V25H558.91ZM570.931 25V27H576.942V25H570.931ZM582.952 25V27H588.963V25H582.952ZM594.974 25V27H600.984V25H594.974ZM606.995 25V27H610C610.799 27 611.584 27.0519 612.354 27.1522L612.612 25.169C611.757 25.0575 610.885 25 610 25H606.995ZM630 54.0652H628V60.1087H630V54.0652ZM630 66.1522H628V72.1957H630V66.1522ZM630 78.2391H628V84.2826H630V78.2391ZM630 90.3261H628V96.3696H630V90.3261ZM630 102.413H628V108.457H630V102.413ZM630 114.5H628V120.543H630V114.5ZM630 126.587H628V132.63H630V126.587ZM630 138.674H628V144.717H630V138.674ZM630 150.761H628V156.804H630V150.761ZM630 162.848H628V168.891H630V162.848ZM630 174.935H628V180.978H630V174.935ZM630 187.022H628V193.065H630V187.022ZM630 199.109H628V205.152H630V199.109ZM630 211.196H628V217.239H630V211.196ZM630 223.283H628V229.326H630V223.283ZM630 235.37H628V241.413H630V235.37ZM630 247.456H628V253.5H630V247.456ZM630 259.543H628V265.587H630V259.543ZM630 271.63H628V277.674H630V271.63ZM630 283.717H628V289.761H630V283.717ZM630 295.804H628V301.848H630V295.804ZM630 307.891H628V313.935H630V307.891ZM630 319.978H628V323C628 323.799 627.948 324.584 627.848 325.353L629.831 325.612C629.942 324.757 630 323.885 630 323V319.978ZM600.984 343V341H594.973V343H600.984ZM588.963 343V341H582.952V343H588.963ZM576.941 343V341H570.931V343H576.941ZM564.92 343V341H558.91V343H564.92ZM552.899 343V341H546.888V343H552.899ZM540.878 343V341H534.867V343H540.878ZM528.856 343V341H522.846V343H528.856ZM516.835 343V341H510.824V343H516.835ZM504.814 343V341H498.803V343H504.814ZM492.793 343V341H486.782V343H492.793ZM480.771 343V341H474.761V343H480.771ZM468.75 343V341H462.739V343H468.75ZM456.729 343V341H450.718V343H456.729ZM444.707 343V341H438.697V343H444.707ZM432.686 343V341H426.676V343H432.686ZM420.665 343V341H414.654V343H420.665ZM408.644 343V341H402.633V343H408.644ZM396.622 343V341H390.612V343H396.622ZM384.601 343V341H378.591V343H384.601ZM372.58 343V341H366.569V343H372.58ZM360.559 343V341H354.548V343H360.559ZM348.537 343V341H342.527V343H348.537ZM336.516 343V341H330.505V343H336.516ZM324.495 343V341H318.484V343H324.495ZM312.473 343V341H306.463V343H312.473ZM300.452 343V341H294.441V343H300.452ZM288.431 343V341H282.42V343H288.431ZM276.41 343V341H270.399V343H276.41ZM264.388 343V341H258.378V343H264.388ZM252.367 343V341H246.356V343H252.367ZM240.346 343V341H234.335V343H240.346ZM228.324 343V341H222.314V343H228.324ZM216.303 343V341H210.292V343H216.303ZM204.282 343V341H198.271V343H204.282ZM192.26 343V341H186.25V343H192.26ZM180.239 343V341H174.228V343H180.239ZM168.218 343V341H162.207V343H168.218ZM156.197 343V341H150.186V343H156.197ZM144.175 343V341H138.165V343H144.175ZM132.154 343V341H126.143V343H132.154ZM120.133 343V341H114.122V343H120.133ZM108.111 343V341H102.101V343H108.111ZM96.09 343V341H90.0794V343H96.09ZM84.0688 343V341H78.0582V343H84.0688ZM72.0476 343V341H66.0369V343H72.0476ZM60.0263 343V341H54.0157V343H60.0263Z"
    fill="#333"
  />
  <path
    d="M312.754 174.953C314.512 173.185 315.5 170.786 315.5 168.286C315.5 165.785 314.512 163.387 312.754 161.619C310.996 159.851 308.611 158.857 306.125 158.857C303.639 158.857 301.254 159.851 299.496 161.619C297.738 163.387 296.75 165.785 296.75 168.286C296.75 170.786 297.738 173.185 299.496 174.953C301.254 176.721 303.639 177.714 306.125 177.714C308.611 177.714 310.996 176.721 312.754 174.953Z"
    fill="#F4F4F4"
  />
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M281.661 143.682C284.005 141.324 287.185 140 290.5 140H365.5C368.815 140 371.995 141.324 374.339 143.682C376.683 146.04 378 149.237 378 152.571V215.429C378 218.763 376.683 221.96 374.339 224.318C371.995 226.676 368.815 228 365.5 228H290.5C287.185 228 284.005 226.676 281.661 224.318C279.317 221.96 278 218.763 278 215.429V152.571C278 149.237 279.317 146.04 281.661 143.682ZM369.919 148.127C368.747 146.948 367.158 146.286 365.5 146.286H290.5C288.842 146.286 287.253 146.948 286.081 148.127C284.908 149.306 284.25 150.904 284.25 152.571V209.143L300.788 194.346C301.298 193.834 301.969 193.516 302.687 193.445C303.405 193.374 304.125 193.555 304.725 193.957L321.35 205.095L344.538 181.775C345.002 181.309 345.6 181.002 346.247 180.897C346.894 180.793 347.558 180.895 348.144 181.19L371.75 193.429V152.571C371.75 150.904 371.092 149.306 369.919 148.127Z"
    fill="#F4F4F4"
  />
</svg>
`

const ImageElementSelect: React.FC<{
  studioId: StudioId
  worldId: WorldId
  element: ImageElement
  onImageSelect: OnImageSelect
}> = ({ studioId, worldId, element, onImageSelect }) => {
  const importInlineImageRef = useRef<{ import: () => void }>(null)

  const editor = useSlate(),
    selected = useSelected()

  const [croppingImage, setCroppingImage] = useState<boolean>(false),
    [loadingImage, setLoadingImage] = useState<boolean>(false),
    [imagePath, setImagePath] = useState<string | undefined>(undefined)

  const removeImage = useCallback(
    (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      event.stopPropagation()

      Transforms.delete(editor, { at: getElement(editor).path })

      ReactEditor.focus(editor)
      Transforms.move(editor)
    },
    [editor]
  )

  useEffect(() => {
    async function getImagePath() {
      if (element.asset_id) {
        const [path, exists]: [string, boolean] = await ipcRenderer.invoke(
          WINDOW_EVENT_TYPE.GET_ASSET,
          {
            studioId,
            worldId,
            id: element.asset_id,
            ext: 'webp'
          }
        )

        // if (path) {
        setImagePath(path)
        return
        // }
      }
    }

    getImagePath()
  }, [element.asset_id])

  return (
    <div className={styles.ImageSelect} contentEditable={false}>
      {selected && <div className={styles.selection} />}

      <ImportAndCropImage
        ref={importInlineImageRef}
        cropping={croppingImage}
        cropAreaStyle={{
          border: 'none'
        }}
        containerStyle={{ background: 'transparent' }}
        aspectRatio={16 / 9}
        quality={0.7}
        onImportImageData={() => setCroppingImage(true)}
        onImportImageCropComplete={async (image) => {
          if (image) {
            setLoadingImage(true)

            try {
              await onImageSelect(image)
            } catch (error) {
              throw error
            }
          }

          setCroppingImage(false)
          setLoadingImage(false)
        }}
        onSelectNewImage={() => importInlineImageRef.current?.import()}
        size={{ width: 655 * 2, height: 368 * 2 }}
      />

      {element.asset_id && imagePath && (
        <div
          className={`${styles.image} ${selected ? styles.selected : ''}`}
          style={{ backgroundImage: imagePath ? `url(${imagePath})` : 'unset' }}
          onClick={() => {
            // TODO: this doesn't work properly with the cache
            // importInlineImageRef.current?.import()
          }}
        >
          <div className={styles.toolbar}>
            <Button danger onClick={removeImage}>
              <DeleteOutlined />
            </Button>
          </div>
        </div>
      )}

      {/* {element.asset_id && !loadingImage && !imagePath && (
        <div>Missing Image...</div>
      )} */}

      {!element.asset_id && (
        <div
          onClick={() => importInlineImageRef.current?.import()}
          className={`${styles.placeholder} ${selected ? styles.selected : ''}`}
          title="Click to select an image..."
          style={{
            backgroundImage: `url(${getSvgUrl(ImageSelectPlaceholder)})`,
            opacity: croppingImage ? 0 : 'unset',
            pointerEvents: croppingImage ? 'none' : 'unset'
          }}
        >
          <div className={styles.toolbar}>
            <Button danger onClick={removeImage}>
              <DeleteOutlined />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

ImageElementSelect.displayName = 'ImageElementSelect'

export default ImageElementSelect

// const editor = useSlateStatic()
//   const path = ReactEditor.findPath(editor, element)
//   const focused = useFocused()
//   const selected = useSelected()

{
  /* <div
        className={`content-image ${selected ? 'selected' : ''}`}
        style={{
          boxShadow: `${
            selected && focused ? '0 0 0 3px var(--highlight-color)' : 'none'
          }`
        }}
        contentEditable={false}
      >
        <img
          draggable="false"
          src={element.url}
          style={{
            display: 'block',
            maxWidth: '100%',
            maxHeight: '30em'
          }}
        />
        <Button
          className="remove-image-button"
          style={{
            position: 'absolute',
            right: '10px',
            bottom: '10px'
          }}
        >
          <DeleteOutlined
            onClick={() => Transforms.removeNodes(editor, { at: path })}
          />
        </Button>
      </div> */
}
