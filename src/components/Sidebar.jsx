import React, { useEffect, useState } from 'react'
import {
  CBadge,
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
  CSidebarNav,
  CSidebarToggler,
  CNavGroup,
  CNavItem,
  CNavTitle,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import {
  cilCloudDownload,
  cilLayers,
  cilPuzzle,
  cilSpeedometer,
  cilUser,
} from '@coreui/icons'

import { Link } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'

const Sidebar = ({ visible, onToggle }) => {
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
    <CSidebar
      className="border-end"
      visible={visible}
      onVisibleChange={onToggle}
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
        <CSidebarToggler />
      </CSidebarHeader>
    </CSidebar>
  )
}

export default Sidebar
