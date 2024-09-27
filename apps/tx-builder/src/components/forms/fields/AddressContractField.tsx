import { ReactElement } from 'react'
import AddressInput from './AddressInput'

const AddressContractField = ({
  id,
  name,
  value,
  onChange,
  label,
  error,
  getAddressFromDomain,
  networkPrefix,
  onBlur,
}: any): ReactElement => {
  return (
    <AddressInput
      id={id}
      name={name}
      label={label}
      address={value}
      inputProps={{ value }}
      onBlur={onBlur}
      showNetworkPrefix={!!networkPrefix}
      networkPrefix={networkPrefix}
      hiddenLabel={false}
      fullWidth
      error={error}
      getAddressFromDomain={getAddressFromDomain}
      onChangeAddress={onChange}
      showErrorsInTheLabel={false}
    />
  )
}

export default AddressContractField
