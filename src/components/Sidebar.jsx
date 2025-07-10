import React, { useEffect, useState } from 'react'
import {
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
  CSidebarNav,
  CNavItem,
  CNavTitle,
  CIcon,
} from '@coreui/react'

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

    checkTeam()
  }, [])

  return (
    <>
      <button
        onClick={() => setVisible(!visible)}
        style={{
          position: 'fixed',
          top: 20,
          left: 20,
          zIndex: 2000,
          backgroundColor: '#343a40',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          padding: '8px 12px',
        }}
      >
        ☰
      </button>

      <CSidebar
        className="border-end"
        visible={visible}
        onVisibleChange={(val) => setVisible(val)}
        overlaid
        style={{ transition: 'transform 0.3s ease-in-out' }}
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
      </CSidebar>
    </>
  )
}

export default Sidebar
