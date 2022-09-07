import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material"

import { DelegateEntry } from "src/hooks/useDelegatesFile"
import { shortenAddress } from "src/utils/format"
import { DelegateAvatar } from "./DelegateAvatar"

export const DelegateCard = ({
  onClick,
  delegate,
  selected,
}: {
  onClick: (delegate: DelegateEntry) => void
  delegate: DelegateEntry
  selected: boolean
}) => {
  return (
    <Card
      variant="outlined"
      sx={({ palette }) => ({
        borderColor: selected ? palette.primary.main : "#EEEFF0",
      })}
    >
      <CardActionArea onClick={() => onClick(delegate)}>
        <CardHeader
          avatar={<DelegateAvatar selected={selected} delegate={delegate} />}
          title={delegate.name}
          subheader={delegate.ens || shortenAddress(delegate.address)}
          sx={{ padding: 0, margin: 2 }}
        />
        <CardContent sx={{ padding: "0 !important", margin: 2 }}>
          <Typography
            sx={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              lineClamp: "2",
              WebkitLineClamp: "2",
              // maxHeight is only needed if the browser does not support lineClamp properly
              maxHeight: "3em",
              minHeight: "3em",
            }}
          >
            {delegate.reason}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
