import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import styled from "styled-components";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      display: "block",
      marginTop: theme.spacing(2)
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120
    }
  })
);


const StyledSelect = styled(Select)`
  background-color: #E8E7E6;
  border-radius: 5px;
  padding:15px;
`;

export default function ControlledOpenSelect() {
  const classes = useStyles();
  const [age, setAge] = React.useState<string | number>("");
  const [open, setOpen] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setAge(event.target.value as number);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-controlled-open-select-label"></InputLabel>
        <StyledSelect
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={age}
          onChange={handleChange}
        >
          <MenuItem value={10}>DAI</MenuItem>
          <MenuItem value={20}>ETH</MenuItem>
          <MenuItem value={30}>CARDANO</MenuItem>
        </StyledSelect>
      </FormControl>
    </div>
  );
}
