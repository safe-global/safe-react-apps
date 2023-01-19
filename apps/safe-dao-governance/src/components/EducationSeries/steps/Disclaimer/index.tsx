import { Grid, Typography } from '@mui/material'
import type { ReactElement } from 'react'

import { StepHeader } from '@/components/StepHeader'
import { NavButtons } from '@/components/NavButtons'
import { useEducationSeriesStepper } from '@/components/EducationSeries'

export const Disclaimer = (): ReactElement => {
  const { onBack, onNext } = useEducationSeriesStepper()

  return (
    <Grid container px={6} pt={5} pb={4}>
      <Grid item xs={12} mb={3}>
        <StepHeader title="Legal Disclaimer" />
      </Grid>

      <Typography mb={3}>
        This App is for our community to encourage Safe ecosystem contributors and users to unlock
        Safe {`{DAO}`} governance.
        <br />
        <br />
        THIS APP IS PROVIDED “AS IS” AND “AS AVAILABLE,” AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF
        ANY KIND. We will not be liable for any loss, whether such loss is direct, indirect, special
        or consequential, suffered by any party as a result of their use of this app.
        <br />
        <br />
        By accessing this app, you represent and warrant
        <br />- that you are of legal age and that you will comply with any laws applicable to you
        and not engage in any illegal activities;
        <br />- that you are claiming Safe tokens to participate in the Safe {`{DAO}`} governance
        process and that they do not represent consideration for past or future services;
        <br />- that you, the country you are a resident of and your wallet address is not on any
        sanctions lists maintained by the United Nations, Switzerland, the EU, UK or the US;
        <br />- that you are responsible for any tax obligations arising out of the interaction with
        this app.
        <br />
        <br />
        None of the information available on this app, or made otherwise available to you in
        relation to its use, constitutes any legal, tax, financial or other advice. Where in doubt
        as to the action you should take, please consult your own legal, financial, tax or other
        professional advisors.
      </Typography>

      <NavButtons onBack={onBack} onNext={onNext} nextLabel="Done" />
    </Grid>
  )
}
