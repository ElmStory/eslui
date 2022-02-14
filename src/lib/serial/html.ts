// #UPDATE
import { getSvgUrl } from '..'
import { ELEMENT_FORMATS, EventContentNode } from '../../data/eventContentTypes'
import { StudioId, WorldId } from '../../data/types'

import {
  getCharacterAliasOrTitle,
  getCharacterRefDisplayFormat
} from '../contentEditor'

import api from '../../api'

const imgPlaceholder = `<svg width="655" height="368" viewBox="0 0 655 368" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="655" height="368" fill="#141414"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M42.3878 342.831L42.6465 340.848C43.4159 340.948 44.2014 341 45 341H48.0051V343H45C44.1147 343 43.2428 342.942 42.3878 342.831ZM606.995 343V341H610C610.799 341 611.584 340.948 612.354 340.848L612.612 342.831C611.757 342.942 610.885 343 610 343H606.995ZM617.656 341.482L616.89 339.635C618.352 339.029 619.718 338.234 620.957 337.282L622.176 338.868C620.799 339.926 619.282 340.808 617.656 341.482ZM625.868 335.176L624.282 333.957C625.234 332.718 626.029 331.352 626.635 329.89L628.482 330.656C627.808 332.282 626.926 333.799 625.868 335.176ZM630 48.0217H628V45C628 44.2014 627.948 43.4159 627.848 42.6465L629.831 42.3878C629.942 43.2428 630 44.1147 630 45V48.0217ZM628.482 37.3442L626.635 38.1104C626.029 36.6481 625.234 35.2822 624.282 34.043L625.868 32.8243C626.926 34.2006 627.808 35.7183 628.482 37.3442ZM622.176 29.132L620.957 30.7179C619.718 29.7655 618.352 28.9714 616.89 28.3651L617.656 26.5176C619.282 27.1919 620.799 28.0744 622.176 29.132ZM48.0053 25H45C44.1147 25 43.2428 25.0575 42.3878 25.169L42.6465 27.1522C43.4159 27.0519 44.2014 27 45 27H48.0053V25ZM37.3442 26.5176L38.1104 28.3651C36.6481 28.9714 35.2822 29.7655 34.043 30.7179L32.8243 29.132C34.2006 28.0744 35.7183 27.1919 37.3442 26.5176ZM29.132 32.8243L30.7179 34.043C29.7655 35.2822 28.9714 36.6481 28.3651 38.1104L26.5176 37.3442C27.1919 35.7183 28.0744 34.2006 29.132 32.8243ZM25 319.978H27V323C27 323.799 27.0519 324.584 27.1522 325.353L25.169 325.612C25.0575 324.757 25 323.885 25 323V319.978ZM26.5176 330.656L28.3651 329.89C28.9714 331.352 29.7655 332.718 30.7179 333.957L29.132 335.176C28.0744 333.799 27.1919 332.282 26.5176 330.656ZM37.3443 341.482L38.1104 339.635C36.6481 339.029 35.2822 338.234 34.043 337.282L32.8243 338.868C34.2006 339.926 35.7183 340.808 37.3443 341.482ZM25 313.935H27V307.891H25V313.935ZM25 301.848H27V295.804H25V301.848ZM25 289.761H27V283.717H25V289.761ZM25 277.674H27V271.63H25V277.674ZM25 265.587H27V259.543H25V265.587ZM25 253.5H27V247.457H25V253.5ZM25 241.413H27V235.37H25V241.413ZM25 229.326H27V223.283H25V229.326ZM25 217.239H27V211.196H25V217.239ZM25 205.152H27V199.109H25V205.152ZM25 193.065H27V187.022H25V193.065ZM25 180.978H27V174.935H25V180.978ZM25 168.891H27V162.848H25V168.891ZM25 156.804H27V150.761H25V156.804ZM25 144.717H27V138.674H25V144.717ZM25 132.63H27V126.587H25V132.63ZM25 120.544H27V114.5H25V120.544ZM25 108.457H27V102.413H25V108.457ZM25 96.3697H27V90.3262H25V96.3697ZM25 84.2827H27V78.2392H25V84.2827ZM25 72.1958H27V66.1523H25V72.1958ZM25 60.1088H27V54.0653H25V60.1088ZM25 48.0218H27V45C27 44.2014 27.0519 43.4159 27.1522 42.6465L25.169 42.3878C25.0575 43.2428 25 44.1147 25 45V48.0218ZM54.016 25V27H60.0266V25H54.016ZM66.0372 25V27H72.0479V25H66.0372ZM78.0585 25V27H84.0691V25H78.0585ZM90.0798 25V27H96.0904V25H90.0798ZM102.101 25V27H108.112V25H102.101ZM114.122 25V27H120.133V25H114.122ZM126.144 25V27H132.154V25H126.144ZM138.165 25V27H144.176V25H138.165ZM150.186 25V27H156.197V25H150.186ZM162.207 25V27H168.218V25H162.207ZM174.229 25V27H180.239V25H174.229ZM186.25 25V27H192.261V25H186.25ZM198.271 25V27H204.282V25H198.271ZM210.293 25V27H216.303V25H210.293ZM222.314 25V27H228.324V25H222.314ZM234.335 25V27H240.346V25H234.335ZM246.356 25V27H252.367V25H246.356ZM258.378 25V27H264.388V25H258.378ZM270.399 25V27H276.41V25H270.399ZM282.42 25V27H288.431V25H282.42ZM294.441 25V27H300.452V25H294.441ZM306.463 25V27H312.473V25H306.463ZM318.484 25V27H324.495V25H318.484ZM330.505 25V27H336.516V25H330.505ZM342.527 25V27H348.537V25H342.527ZM354.548 25V27H360.559V25H354.548ZM366.569 25V27H372.58V25H366.569ZM378.59 25V27H384.601V25H378.59ZM390.612 25V27H396.622V25H390.612ZM402.633 25V27H408.644V25H402.633ZM414.654 25V27H420.665V25H414.654ZM426.676 25V27H432.686V25H426.676ZM438.697 25V27H444.708V25H438.697ZM450.718 25V27H456.729V25H450.718ZM462.74 25V27H468.75V25H462.74ZM474.761 25V27H480.772V25H474.761ZM486.782 25V27H492.793V25H486.782ZM498.803 25V27H504.814V25H498.803ZM510.825 25V27H516.835V25H510.825ZM522.846 25V27H528.857V25H522.846ZM534.867 25V27H540.878V25H534.867ZM546.889 25V27H552.899V25H546.889ZM558.91 25V27H564.921V25H558.91ZM570.931 25V27H576.942V25H570.931ZM582.952 25V27H588.963V25H582.952ZM594.974 25V27H600.984V25H594.974ZM606.995 25V27H610C610.799 27 611.584 27.0519 612.354 27.1522L612.612 25.169C611.757 25.0575 610.885 25 610 25H606.995ZM630 54.0652H628V60.1087H630V54.0652ZM630 66.1522H628V72.1957H630V66.1522ZM630 78.2391H628V84.2826H630V78.2391ZM630 90.3261H628V96.3696H630V90.3261ZM630 102.413H628V108.457H630V102.413ZM630 114.5H628V120.543H630V114.5ZM630 126.587H628V132.63H630V126.587ZM630 138.674H628V144.717H630V138.674ZM630 150.761H628V156.804H630V150.761ZM630 162.848H628V168.891H630V162.848ZM630 174.935H628V180.978H630V174.935ZM630 187.022H628V193.065H630V187.022ZM630 199.109H628V205.152H630V199.109ZM630 211.196H628V217.239H630V211.196ZM630 223.283H628V229.326H630V223.283ZM630 235.37H628V241.413H630V235.37ZM630 247.456H628V253.5H630V247.456ZM630 259.543H628V265.587H630V259.543ZM630 271.63H628V277.674H630V271.63ZM630 283.717H628V289.761H630V283.717ZM630 295.804H628V301.848H630V295.804ZM630 307.891H628V313.935H630V307.891ZM630 319.978H628V323C628 323.799 627.948 324.584 627.848 325.353L629.831 325.612C629.942 324.757 630 323.885 630 323V319.978ZM600.984 343V341H594.973V343H600.984ZM588.963 343V341H582.952V343H588.963ZM576.941 343V341H570.931V343H576.941ZM564.92 343V341H558.91V343H564.92ZM552.899 343V341H546.888V343H552.899ZM540.878 343V341H534.867V343H540.878ZM528.856 343V341H522.846V343H528.856ZM516.835 343V341H510.824V343H516.835ZM504.814 343V341H498.803V343H504.814ZM492.793 343V341H486.782V343H492.793ZM480.771 343V341H474.761V343H480.771ZM468.75 343V341H462.739V343H468.75ZM456.729 343V341H450.718V343H456.729ZM444.707 343V341H438.697V343H444.707ZM432.686 343V341H426.676V343H432.686ZM420.665 343V341H414.654V343H420.665ZM408.644 343V341H402.633V343H408.644ZM396.622 343V341H390.612V343H396.622ZM384.601 343V341H378.591V343H384.601ZM372.58 343V341H366.569V343H372.58ZM360.559 343V341H354.548V343H360.559ZM348.537 343V341H342.527V343H348.537ZM336.516 343V341H330.505V343H336.516ZM324.495 343V341H318.484V343H324.495ZM312.473 343V341H306.463V343H312.473ZM300.452 343V341H294.441V343H300.452ZM288.431 343V341H282.42V343H288.431ZM276.41 343V341H270.399V343H276.41ZM264.388 343V341H258.378V343H264.388ZM252.367 343V341H246.356V343H252.367ZM240.346 343V341H234.335V343H240.346ZM228.324 343V341H222.314V343H228.324ZM216.303 343V341H210.292V343H216.303ZM204.282 343V341H198.271V343H204.282ZM192.26 343V341H186.25V343H192.26ZM180.239 343V341H174.228V343H180.239ZM168.218 343V341H162.207V343H168.218ZM156.197 343V341H150.186V343H156.197ZM144.175 343V341H138.165V343H144.175ZM132.154 343V341H126.143V343H132.154ZM120.133 343V341H114.122V343H120.133ZM108.111 343V341H102.101V343H108.111ZM96.09 343V341H90.0794V343H96.09ZM84.0688 343V341H78.0582V343H84.0688ZM72.0476 343V341H66.0369V343H72.0476ZM60.0263 343V341H54.0157V343H60.0263Z" fill="#333333"/>
<path d="M352.031 192.958C349.336 192.958 346.855 192.579 344.588 191.821C342.321 191.063 340.429 189.968 338.913 188.536C338.517 187.441 338.4 185.715 338.563 183.357C338.726 180.998 338.979 178.85 339.32 176.913C339.469 176.071 340.175 175.65 341.438 175.65C341.943 175.65 342.367 175.755 342.709 175.966C343.051 176.176 343.234 176.45 343.259 176.787C343.825 180.746 345.066 183.735 346.984 185.757C348.902 187.778 351.208 188.789 353.903 188.789C356.262 188.789 358.336 188.01 360.127 186.452C361.918 184.894 363.006 183.02 363.392 180.83C363.793 178.556 363.331 176.639 362.006 175.081C360.68 173.523 358.553 171.733 355.625 169.712C353.212 168.111 351.174 166.532 349.511 164.974C347.849 163.416 346.679 161.689 346.003 159.794C345.326 157.899 345.203 155.73 345.634 153.287C346.154 150.34 347.351 147.729 349.226 145.454C351.101 143.18 353.505 141.369 356.438 140.022C359.37 138.674 362.732 138 366.523 138C369.218 138 371.465 138.274 373.263 138.821C375.063 139.369 376.331 139.937 377.069 140.527C377.579 141.453 377.881 142.97 377.973 145.075C378.064 147.181 377.925 149.287 377.553 151.392C377.435 152.066 376.828 152.403 375.733 152.403C375.228 152.403 374.724 152.277 374.22 152.024C373.718 151.771 373.419 151.435 373.324 151.013C372.749 148.065 371.774 145.833 370.4 144.317C369.024 142.801 367.157 142.043 364.799 142.043C362.777 142.043 360.859 142.654 359.044 143.875C357.228 145.096 356.119 146.844 355.718 149.118C355.377 151.055 355.771 152.761 356.901 154.235C358.03 155.709 359.964 157.288 362.698 158.973C367.261 161.752 370.525 164.384 372.488 166.869C374.449 169.354 375.067 172.66 374.34 176.787C373.478 181.672 371.04 185.588 367.025 188.536C363.009 191.484 358.011 192.958 352.031 192.958Z" fill="#F4F4F4"/>
<path d="M281.032 229.899C280.106 229.899 279.369 229.73 278.821 229.393C278.274 229.057 278 228.635 278 228.13C278 227.035 279.095 226.235 281.285 225.73C284.317 224.972 286.486 224.024 287.792 222.887C289.097 221.75 289.75 219.792 289.75 217.012V159.779C289.75 156.916 289.182 154.894 288.044 153.715C286.907 152.536 284.78 151.61 281.664 150.936C280.485 150.683 279.643 150.325 279.137 149.862C278.632 149.399 278.379 148.914 278.379 148.409C278.379 147.82 278.653 147.377 279.201 147.083C279.748 146.787 280.485 146.64 281.411 146.64C283.854 146.64 286.191 146.682 288.423 146.767C290.655 146.851 292.824 146.935 294.93 147.019C297.036 147.104 299.225 147.145 301.5 147.145C305.374 147.145 309.48 147.104 313.818 147.019C318.156 146.935 322.051 146.893 325.504 146.893C328.284 146.808 330.579 146.682 332.39 146.514C334.201 146.346 335.275 146.261 335.612 146.261C336.202 146.261 336.812 146.388 337.444 146.64C338.076 146.893 338.433 147.398 338.518 148.157C338.855 150.936 339.276 153.673 339.781 156.368C340.287 159.064 340.539 161.422 340.539 163.444C340.539 164.202 340.35 164.77 339.971 165.149C339.592 165.528 339.192 165.718 338.771 165.718C338.349 165.718 337.97 165.57 337.633 165.276C337.297 164.981 337.001 164.539 336.749 163.949C336.075 162.012 335.443 160.327 334.854 158.895C334.264 157.463 333.59 156.368 332.832 155.61C331.738 154.431 330.474 153.505 329.042 152.831C327.61 152.157 325.884 151.82 323.862 151.82H312.112C310.596 151.82 309.206 152.262 307.943 153.147C306.68 154.031 306.048 155.273 306.048 156.874V181.637C306.048 182.563 306.322 183.279 306.869 183.784C307.417 184.29 308.069 184.543 308.828 184.543H320.451C322.725 184.543 324.346 183.911 325.315 182.647C326.283 181.384 327.105 179.657 327.779 177.467C328.368 175.783 329.168 174.94 330.179 174.94C330.6 174.94 330.979 175.172 331.316 175.635C331.653 176.099 331.822 176.709 331.822 177.467C331.738 178.31 331.653 179.32 331.569 180.499C331.485 181.679 331.422 182.858 331.379 184.037C331.337 185.216 331.316 186.269 331.316 187.195C331.316 188.206 331.337 189.343 331.379 190.607C331.422 191.87 331.464 193.113 331.506 194.334C331.548 195.555 331.611 196.587 331.695 197.429C331.78 198.356 331.716 199.072 331.506 199.577C331.295 200.083 330.937 200.335 330.432 200.335C329.084 200.335 328.116 199.156 327.526 196.798C326.852 194.439 326.052 192.671 325.125 191.491C324.199 190.312 322.936 189.722 321.335 189.722H309.459C308.364 189.722 307.522 189.933 306.932 190.354C306.343 190.775 306.048 191.576 306.048 192.755V216.759C306.048 219.539 306.637 221.476 307.817 222.571C308.996 223.666 310.807 224.214 313.249 224.214H323.609C325.715 224.214 327.631 224.003 329.358 223.582C331.085 223.161 332.58 222.487 333.843 221.56C335.275 220.549 336.56 219.181 337.696 217.454C338.834 215.728 339.949 213.812 341.044 211.706C341.381 211.032 341.718 210.59 342.055 210.379C342.392 210.169 342.813 210.063 343.319 210.063C343.74 210.148 344.056 210.4 344.266 210.821C344.477 211.243 344.582 211.706 344.582 212.211C344.582 213.39 344.371 214.906 343.95 216.759C343.529 218.612 343.003 220.528 342.371 222.508C341.739 224.487 341.171 226.319 340.666 228.004C340.413 228.593 340.076 229.035 339.655 229.33C339.234 229.625 338.728 229.772 338.139 229.772C336.117 229.772 333.527 229.751 330.369 229.709C327.21 229.667 323.778 229.604 320.072 229.52C316.366 229.436 312.575 229.372 308.701 229.33C304.827 229.288 301.12 229.267 297.583 229.267C295.814 229.267 294.024 229.309 292.214 229.393C290.402 229.478 288.571 229.583 286.718 229.709C284.865 229.836 282.97 229.899 281.032 229.899Z" fill="#F4F4F4"/>
</svg>
`

const wrapNodeContent = (node: EventContentNode, text: string) => {
  switch (node.type) {
    case ELEMENT_FORMATS.P:
      return `<p style="text-align:${node.align || ''}">${text || '&nbsp;'}</p>`
    case ELEMENT_FORMATS.H1:
      return `<h1 style="text-align:${node.align || ''}">${
        text || '&nbsp;'
      }</h1>`
    case ELEMENT_FORMATS.H2:
      return `<h2 style="text-align:${node.align || ''}">${
        text || '&nbsp;'
      }</h2>`
    case ELEMENT_FORMATS.H3:
      return `<h3 style="text-align:${node.align || ''}">${
        text || '&nbsp;'
      }</h3>`
    case ELEMENT_FORMATS.H4:
      return `<h4 style="text-align:${node.align || ''}">${
        text || '&nbsp;'
      }</h4>`
    case ELEMENT_FORMATS.LI:
      return `<li>${text}</li>`
    case ELEMENT_FORMATS.BLOCKQUOTE:
      return `<blockquote>${text}</blockquote>`
    default:
      return `<p>${text || '&nbsp;'}</p>`
  }
}

const serializeDescendantToText = async (
  studioId: StudioId,
  worldId: WorldId,
  node: EventContentNode
): Promise<string> => {
  let formattedNode: string = node.text

  if (node.text) {
    if (node.u) {
      formattedNode = `<u>${formattedNode}</u>`
    }

    if (node.em) {
      formattedNode = `<em>${formattedNode}</em>`
    }

    if (node.strong) {
      formattedNode = `<strong>${formattedNode}</strong>`
    }

    if (node.s) {
      formattedNode = `<s>${formattedNode}</s>`
    }

    return formattedNode
  }

  const text: string = node.children
    ? `${wrapNodeContent(
        node,
        (
          await Promise.all(
            node.children.map(
              async (childNode) =>
                await serializeDescendantToText(
                  studioId,
                  worldId,
                  childNode as EventContentNode
                )
            )
          )
        ).join('')
      )}`
    : ''

  switch (node.type) {
    case ELEMENT_FORMATS.IMG:
      // prettier-ignore
      return `<div className="event-content-image" title="${!node.asset_id ? 'Image not set...' : ''}" style="backgroundImage:url(${node.asset_id ? `./assets/content/${node.asset_id}.webp` : getSvgUrl(imgPlaceholder)})"></div>`
    case ELEMENT_FORMATS.CHARACTER:
      if (!node.character_id) return `<span>I AM ERROR</span>`

      const character = node.character_id
        ? await api().characters.getCharacter(studioId, node.character_id)
        : undefined

      if (!character) return `<span>I AM ERROR</span>`

      const displayFormat = getCharacterRefDisplayFormat(
        (await getCharacterAliasOrTitle(character, node.alias_id)) || '',
        node.transform || 'cap',
        node.styles
      )

      // prettier-ignore
      return `<span style="font-weight:${displayFormat.styles?.fontWeight || ''}; font-style:${displayFormat.styles?.fontStyle || ''}; text-decoration:${displayFormat.styles?.textDecoration};">${displayFormat.text}</span>`
    case ELEMENT_FORMATS.OL:
    case ELEMENT_FORMATS.UL:
      return node.children
        ? `${node.type === ELEMENT_FORMATS.OL ? '<ol>' : '<ul>'}${(
            await Promise.all(
              node.children.map(
                async (childNode) =>
                  await serializeDescendantToText(
                    studioId,
                    worldId,
                    childNode as EventContentNode
                  )
              )
            )
          ).join('')}${node.type === ELEMENT_FORMATS.OL ? '</ol>' : '</ul>'}`
        : ''
    default:
      return text
  }
}

export const eventContentToHTML = async (
  studioId: StudioId,
  worldId: WorldId,
  content: EventContentNode[]
) => {
  const startingElement =
    content[0].type === ELEMENT_FORMATS.IMG
      ? await serializeDescendantToText(studioId, worldId, content[0])
      : undefined

  const text = (
    await Promise.all(
      content.map(async (childNode) => {
        return await serializeDescendantToText(studioId, worldId, childNode)
      })
    )
  )
    .filter((text) => text)
    .join('')

  return {
    startingElement,
    text:
      text === '<p></p>' ||
      text === '<h1></h1>' ||
      text === '<h2></h2>' ||
      text === '<h3></h3>' ||
      text === '<h4></h4>'
        ? `<p class="engine-warning-message">Event content required.</p>`
        : text
  }
}