import styled from 'styled-components';

type EditableLabelProps = {
  children: React.ReactNode;
  onEdit: (value: string) => void;
};

const EditableLabel = ({ children, onEdit }: EditableLabelProps) => {
  return (
    <EditableComponent
      contentEditable="true"
      suppressContentEditableWarning={true}
      onBlur={(event) => onEdit(event.target.innerText)}
      onKeyPress={(event: any) => event.key === 'Enter' && event.target.blur() && event.preventDefault()}
      onClick={(event) => event.stopPropagation()}
    >
      {children}
    </EditableComponent>
  );
};

export default EditableLabel;

const EditableComponent = styled.span`
  display: block;
  white-space: nowrap;
  overflow: hidden;

  padding: 10px;
  cursor: text;
  border-radius: 8px;
  border: 1px solid transparent;

  &:hover {
    border-color: #e2e3e3;
  }

  &:focus {
    outline-color: #008c73;
  }
`;
