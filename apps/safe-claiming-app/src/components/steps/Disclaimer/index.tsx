import { Paper, Typography } from "@mui/material"
import Box from "@mui/system/Box"
import { NavButtons } from "src/components/helpers/NavButtons"

type Props = {
  handleBack: () => void
  handleNext: () => void
}

const Disclaimer = ({ handleNext, handleBack }: Props) => {
  return (
    <Paper elevation={0} sx={{ padding: 6 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-end"
        marginBottom={3}
      >
        <Typography fontWeight={700} variant="h4">
          Legal Disclaimer
        </Typography>
      </Box>
      <Typography>
        This App is for our community to encourage Safe ecosystem contributors
        and users to unlock SafeDAO governance. <br /> <br />
        THIS APP IS PROVIDED “AS IS” AND “AS AVAILABLE,” AT YOUR OWN RISK, AND
        WITHOUT WARRANTIES OF ANY KIND. We will not be liable for any loss,
        whether such loss is direct, indirect, special or consequential,
        suffered by any party as a result of their use of this app. <br />
        <br />
        By accessing this app, you represent and warrant
        <br />- that you are of legal age and that you will comply with any laws
        applicable to you and not engage in any illegal activities;
        <br /> - that you are claiming Safe tokens to participate in the SafeDAO
        governance process and that they do not represent consideration for past
        or future services;
        <br /> - that you, the country you are a resident of and your wallet
        address is not on any sanctions lists maintained by the United Nations,
        Switzerland, the EU, UK or the US;
        <br /> - that you are responsible for any tax obligations arising out of
        the interaction with this app. <br />
        <br /> None of the information available on this app, or made otherwise
        available to you in relation to its use, constitutes any legal, tax,
        financial or other advice. Where in doubt as to the action you should
        take, please consult your own legal, financial, tax or other
        professional advisors.
      </Typography>

      <NavButtons handleBack={handleBack} handleNext={handleNext} />
    </Paper>
  )
}

export default Disclaimer
