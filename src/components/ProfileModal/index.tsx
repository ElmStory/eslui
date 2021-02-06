import React from 'react'

import type { ModalProps } from '../Modal'
import type { Profile } from '../../db'

import Modal from '../Modal'
import Button from '../Button'

import styles from './styles.module.scss'
import { useState } from 'react'
import { useProfiles, useSelectedProfile } from '../../hooks'
import { useEffect } from 'react'
import { useRef } from 'react'

interface ProfileModalProps extends ModalProps {
  profile?: Profile
  create?: boolean
  edit?: boolean
  remove?: boolean
}

interface SaveProfileLayoutProps extends ProfileModalProps {
  existing: boolean
}

const SaveProfileLayout = ({
  profile,
  show,
  onHide,
  existing = false
}: SaveProfileLayoutProps) => {
  const [name, setName] = useState(existing && profile ? profile.name : '')
  const [, setSelected] = useSelectedProfile()
  const { save } = useProfiles()
  const nameInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (show) {
      if (!existing) setName('')
      if (nameInput && nameInput.current) nameInput.current.focus()
    }
  }, [show])

  async function addProfile(event: React.MouseEvent) {
    event.preventDefault()
    if (name) {
      await setSelected(
        existing && profile
          ? await save({ name, existing, id: profile.id })
          : await save({ name })
      )
      if (onHide) onHide()
    } else {
      throw new Error('Profile name required.')
    }
  }

  return (
    <>
      <h3>{existing && profile ? 'Edit ' : 'New '} Profile</h3>
      <form>
        <input
          type="value"
          placeholder="Profile Name"
          onChange={(event) => setName(event.target.value)}
          value={name}
          ref={nameInput}
        />
        <Button
          type="submit"
          onClick={(event) => addProfile(event)}
          disabled={!name}
          primary
        >
          Save
        </Button>
      </form>
    </>
  )
}

const RemoveProfileLayout = ({ profile, onHide }: ProfileModalProps) => {
  const { remove } = useProfiles()

  async function removeProfile() {
    if (profile) remove(profile.id)
    if (onHide) onHide()
  }

  if (!profile)
    throw new Error(
      'Unable to use remove profile layout. Missing profile data.'
    )

  return (
    <>
      <h3>Remove Profile</h3>
      <div>Are you sure you want to remove profile '{profile.name}'?</div>
      <div>All games under this profile will be removed forever.</div>
      <Button onClick={removeProfile} destroy>
        Remove
      </Button>
    </>
  )
}

export default ({
  profile,
  show = false,
  create = true,
  edit = false,
  remove = false,
  onHide
}: ProfileModalProps) => {
  if (edit || remove) create = false

  return (
    <Modal show={show} className={styles.profileModal}>
      {create ? (
        <SaveProfileLayout show={show} onHide={onHide} existing={false} />
      ) : null}
      {edit ? (
        <SaveProfileLayout
          show={show}
          profile={profile}
          onHide={onHide}
          existing
        />
      ) : null}
      {remove ? (
        <RemoveProfileLayout profile={profile} onHide={onHide} />
      ) : null}
      <Button onClick={onHide}>Cancel</Button>
    </Modal>
  )
}
