import { Card, CardHeader, IconButton } from "@mui/material"
import { useState } from "react"

import CheckSharpIcon from "@mui/icons-material/CheckSharp"
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined"
import { DelegateEntry } from "src/hooks/useDelegatesFile"
import { DelegateAvatar } from "../Delegate/DelegateAvatar"
import { shortenAddress } from "src/utils/format"

export const SelectedDelegate = ({
  onClick,
  delegate,
}: {
  onClick?: () => void
  delegate: DelegateEntry
}) => {
  const [isHover, setIsHover] = useState(false)

  const hasAction = onClick !== undefined
  return (
    <Card variant={hasAction ? "outlined" : "elevation"} elevation={0}>
      <CardHeader
        avatar={<DelegateAvatar selected={false} delegate={delegate} />}
        title={delegate.name}
        subheader={delegate.ens ?? shortenAddress(delegate.address)}
        sx={{
          "& .MuiCardHeader-action": {
            margin: "0px",
          },
        }}
        action={
          hasAction && (
            <IconButton
              color={isHover ? "primary" : undefined}
              sx={{
                backgroundColor: "background.default",
              }}
              onMouseEnter={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}
              onClick={onClick}
            >
              {isHover ? <ModeEditOutlinedIcon /> : <CheckSharpIcon />}
            </IconButton>
          )
        }
      />
    </Card>
  )
}
