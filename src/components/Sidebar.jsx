import React, { useEffect, useState } from 'react'
import {
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
  CSidebarNav,
  CSidebarToggler,
  CNavItem,
  CNavTitle,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilPuzzle,
  cilUser,
} from '@coreui/icons'

import { Link } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'

const Sidebar = () => {
  const [visible, setVisible] = useState(false)
  const [hasTeam, setHasTeam] = useState(false)

  useEffect(() => {
    const checkTeam = async () => {
      const user = auth.currentUser
      if (user) {
        const docRef = doc(db, 'teams', user.uid)
        const docSnap = await getDoc(docRef)
        setHasTeam(docSnap.exists())
      }
    }

    if (visible) checkTeam()
  }, [visible])

  return (
    <>
      <button
        onClick={() => setVisible(!visible)}
        style={{
          position: 'fixed',
          top: 20,
          left: 20,
          zIndex: 1001,
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          padding: '8px 12px',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        ☰
      </button>

      <CSidebar
        className="border-end"
        visible={visible}
        onVisibleChange={setVisible}
        unfoldable
        overlaid
      >
        <CSidebarHeader className="border-bottom">
          <CSidebarBrand>Gorkha Esports</CSidebarBrand>
        </CSidebarHeader>

        <CSidebarNav>
          <CNavTitle>Dashboard</CNavTitle>

          <CNavItem component={Link} to="/dashboard">
            <CIcon customClassName="nav-icon" icon={cilSpeedometer} />
            Dashboard
          </CNavItem>

          <CNavItem component={Link} to={hasTeam ? '/my-team' : '/add-team'}>
            <CIcon customClassName="nav-icon" icon={cilUser} />
            {hasTeam ? 'My Team' : 'Add Team'}
          </CNavItem>

          <CNavItem component={Link} to="/scrims">
            <CIcon customClassName="nav-icon" icon={cilPuzzle} />
            Scrims
          </CNavItem>
        </CSidebarNav>

        <CSidebarHeader className="border-top">
          <CSidebarToggler onClick={() => setVisible(false)} />
        </CSidebarHeader>
      </CSidebar>
    </>
  )
}

export default Sidebar
