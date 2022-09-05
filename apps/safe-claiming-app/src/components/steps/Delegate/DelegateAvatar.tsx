import { Avatar } from "@mui/material"
import { DelegateEntry } from "src/hooks/useDelegatesFile"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import { GUARDIANS_IMAGE_URL } from "src/config/constants"

export const DelegateAvatar = ({
  delegate,
  selected,
}: {
  delegate: DelegateEntry
  selected: boolean
}) => {
  return (
    <span>
      <Avatar
        variant="circular"
        src={`${GUARDIANS_IMAGE_URL}${delegate.address}_1x.png`}
        alt={delegate.name}
      />
      {selected && (
        <CheckCircleRoundedIcon
          height={22}
          width={22}
          color="primary"
          sx={{
            position: "absolute",
            top: "10px",
            left: "10px",
            backgroundColor: "#fff",
            borderRadius: "10px",
          }}
        />
      )}
    </span>
  )
}
