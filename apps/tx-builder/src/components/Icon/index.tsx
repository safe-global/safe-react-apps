import React from 'react'
import styled from 'styled-components'

import add from './images/add'
import addressBook from './images/addressBook'
import addressBookAdd from './images/addressBookAdd'
import alert from './images/alert'
import allowances from './images/allowances'
import apps from './images/apps'
import arrowUp from './images/arrowUp'
import arrowRight from './images/arrowRight'
import arrowDown from './images/arrowDown'
import arrowLeft from './images/arrowLeft'
import assets from './images/assets'
import awaitingConfirmations from './images/awaitingConfirmations'
import bookmark from './images/bookmark'
import bookmarkFilled from './images/bookmarkFilled'
import camera from './images/camera'
import chain from './images/chain'
import check from './images/check'
import circleCheck from './images/circleCheck'
import circleCross from './images/circleCross'
import circleDropdown from './images/circleDropdown'
import code from './images/code'
import collectibles from './images/collectibles'
import copy from './images/copy'
import cross from './images/cross'
import currency from './images/currency'
import deleteIcon from './images/delete'
import devicePassword from './images/devicePassword'
import edit from './images/edit'
import error from './images/error'
import eth from './images/eth'
import exportImg from './images/export'
import externalLink from './images/externalLink'
import eye from './images/eye'
import eyeOff from './images/eyeOff'
import filledCross from './images/filledCross'
import fingerPrint from './images/fingerPrint'
import fuelIndicator from './images/fuelIndicator'
import getInTouch from './images/getInTouch'
import gift from './images/gift'
import home from './images/home'
import importImg from './images/import'
import info from './images/info'
import knowledge from './images/knowledge'
import licenses from './images/licenses'
import loadSafe from './images/loadSafe'
import locked from './images/locked'
import mobileConfirm from './images/mobileConfirm'
import noInternet from './images/noInternet'
import owners from './images/owners'
import paste from './images/paste'
import paymentToken from './images/paymentToken'
import privacyPolicy from './images/privacyPolicy'
import qrCode from './images/qrCode'
import question from './images/question'
import rateApp from './images/rateApp'
import received from './images/received'
import recover from './images/recover'
import replaceOwner from './images/replaceOwner'
import requiredConfirmations from './images/requiredConfirmations'
import restricted from './images/restricted'
import resync from './images/resync'
import rocket from './images/rocket'
import safe from './images/safe'
import scan from './images/scan'
import search from './images/search'
import sendAgain from './images/sendAgain'
import sent from './images/sent'
import serverError from './images/serverError'
import settings from './images/settings'
import settingsChange from './images/settingsChange'
import settingsTool from './images/settingsTool'
import share from './images/share'
import termsOfUse from './images/termsOfUse'
import transactionsInactive from './images/transactionsInactive'
import unlocked from './images/unlocked'
import userEdit from './images/userEdit'
import wallet from './images/wallet'
import { type Theme } from '@material-ui/core/styles'
import { Tooltip } from '../Tooltip'

const StyledIcon = styled.span<{ color?: keyof Theme['palette'] }>`
  display: inline-flex;

  .icon-color {
    fill: ${({ theme, color }) => (color ? theme.palette[color].main : '#B2B5B2')};
  }

  .icon-stroke {
    stroke: ${({ theme, color }) => (color ? theme.palette[color].main : '#B2B5B2')};
  }
`

const icons = {
  add,
  addressBook,
  addressBookAdd,
  alert,
  allowances,
  apps,
  arrowUp,
  arrowLeft,
  arrowDown,
  arrowRight,
  assets,
  awaitingConfirmations,
  bookmark,
  bookmarkFilled,
  camera,
  chain,
  check,
  circleCheck,
  circleCross,
  circleDropdown,
  code,
  collectibles,
  copy,
  cross,
  currency,
  delete: deleteIcon,
  devicePassword,
  edit,
  error,
  eth,
  exportImg,
  externalLink,
  eye,
  eyeOff,
  filledCross,
  fingerPrint,
  fuelIndicator,
  getInTouch,
  gift,
  home,
  importImg,
  info,
  knowledge,
  licenses,
  loadSafe,
  locked,
  mobileConfirm,
  noInternet,
  owners,
  paste,
  paymentToken,
  privacyPolicy,
  qrCode,
  question,
  rateApp,
  received,
  recover,
  replaceOwner,
  requiredConfirmations,
  restricted,
  resync,
  rocket,
  safe,
  scan,
  search,
  sendAgain,
  sent,
  serverError,
  settings,
  settingsChange,
  settingsTool,
  share,
  termsOfUse,
  transactionsInactive,
  unlocked,
  userEdit,
  wallet,
}

export type IconType = typeof icons
export type IconTypes = keyof IconType

export type IconProps = {
  type: IconTypes
  size: 'sm' | 'md'
  color?: keyof Theme['palette']
  tooltip?: string
  className?: string
}

/**
 * The `Icon` renders an icon, it can be one already defined specified by
 * the type Iconprops or custom one using the customUrl.
 */
export const Icon = ({ type, size, color, tooltip, className }: IconProps): React.ReactElement => {
  const IconElement = (
    <StyledIcon color={color} className={className}>
      {icons[type][size]}
    </StyledIcon>
  )
  return tooltip === undefined ? (
    IconElement
  ) : (
    <Tooltip title={tooltip} placement="top">
      {IconElement}
    </Tooltip>
  )
}
