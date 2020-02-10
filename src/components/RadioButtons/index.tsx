import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup, { RadioGroupProps } from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

type Props = {
  name: string;
  value: any;
  onRadioChange: (value: string) => void;
  options: Array<{
    label: string;
    value: any;
  }>;
} & RadioGroupProps;

const RadioButtons = ({
  name,
  value,
  onRadioChange,
  options,
  ...rest
}: Props) => {
  const onChangeInternal = (event: React.ChangeEvent<HTMLInputElement>) =>
    onRadioChange((event.target as HTMLInputElement).value);

  return (
    <RadioGroup
      aria-label={name}
      name={name}
      value={value}
      onChange={onChangeInternal}
      {...rest}>
      {options.map(o => (
        <FormControlLabel
          key={o.value}
          label={o.label}
          value={o.value}
          control={<Radio color="primary" />}
        />
      ))}
    </RadioGroup>
  );
};

export default RadioButtons;
