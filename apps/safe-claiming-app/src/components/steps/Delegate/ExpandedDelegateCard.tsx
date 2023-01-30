import CloseIcon from "@mui/icons-material/Close"
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Link,
  Typography,
} from "@mui/material"
import { NavButtons } from "src/components/helpers/NavButtons"
import { DelegateEntry } from "src/hooks/useDelegatesFile"
import { getExplorerURL, shortenAddress } from "src/utils/format"
import { DelegateAvatar } from "./DelegateAvatar"
import { ReactComponent as ExternalLink } from "src/assets/images/external_link.svg"
import { useSafeAppsSDK } from "@safe-global/safe-apps-react-sdk"

export const ExpandedDelegateCard = ({
  onClick,
  delegate,
  selected,
  onClose,
}: {
  onClick: (delegate: DelegateEntry) => void
  delegate: DelegateEntry
  selected: boolean
  onClose?: () => void
}) => {
  const { safe } = useSafeAppsSDK()

  return (
    <Card
      variant="outlined"
      sx={({ palette }) => ({
        borderColor: selected ? palette.primary.main : "#EEEFF0",
      })}
    >
      <CardHeader
        avatar={<DelegateAvatar selected={selected} delegate={delegate} />}
        action={
          <IconButton onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        }
        title={delegate.name}
        subheader={
          <>
            <Typography display="inline-flex" alignItems="flex-start" gap={1}>
              {delegate.ens || shortenAddress(delegate.address)}
              <Link
                href={getExplorerURL(delegate.address, safe.chainId.toString())}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink />
              </Link>
            </Typography>
          </>
        }
        sx={{ padding: 0, margin: 2 }}
      />
      <CardContent sx={{ padding: "0 !important", margin: 2 }}>
        <Typography fontWeight={700}>
          What are your reasons for wanting to be a delegate?
        </Typography>
        <Typography>{delegate.reason}</Typography>
        {delegate.contribution && (
          <>
            <Typography mt={2} fontWeight={700}>
              As a founding Guardian, what was your previous contribution?
            </Typography>
            <Typography sx={{ wordBreak: "break-word" }}>
              {delegate.contribution}
            </Typography>
          </>
        )}

        <NavButtons
          handleBack={onClose}
          handleNext={() => onClick(delegate)}
          nextLabel="Select as delegate"
        />
      </CardContent>
    </Card>
  )
}
