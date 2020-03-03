import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import SelectMUI from "@material-ui/core/Select";
import styled from "styled-components";

const IconImg = styled.img`
  width: 20px;
  margin-right: 10px;
`;

const StyledSelect = styled(SelectMUI)`
  background-color: #e8e7e6;
  border-radius: 5px;
  height: 56px;
  width: 140px;

  .MuiSelect-select {
    display: flex;
    align-items: center;
    padding-left: 15px;
  }
`;

type Props = {
  items: Array<{ id: string; label: string; iconUrl?: string }>;
  activeItemId: string;
  onItemClick: (id: string) => void;
  id?: string;
};

function Select({ items, activeItemId, onItemClick, id }: Props) {
  const [open, setOpen] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    onItemClick(event.target.value as string);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      <FormControl>
        <StyledSelect
          labelId={id ? id : "generic-select"}
          id={id ? id : "generic-select"}
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={activeItemId}
          onChange={handleChange}
        >
          {items.map(i => {
            return (
              <MenuItem value={i.id}>
                {i.iconUrl && <IconImg alt={i.label} src={i.iconUrl} />}
                <span>{i.label}</span>
              </MenuItem>
            );
          })}
        </StyledSelect>
      </FormControl>
    </div>
  );
}

export default Select;
