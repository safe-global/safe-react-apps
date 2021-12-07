import { Link } from '@material-ui/core';
import { useState, SyntheticEvent } from 'react';

type ShowMoreTextProps = {
  children: string;
  moreLabel?: string;
  lessLabel?: string;
  splitIndex?: number;
};

const SHOW_MORE = 'Show more';
const SHOW_LESS = 'Show less';

export const ShowMoreText = ({
  children,
  moreLabel = SHOW_MORE,
  lessLabel = SHOW_LESS,
  splitIndex = 50,
}: ShowMoreTextProps) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = (event: SyntheticEvent) => {
    event.preventDefault();
    setExpanded(!expanded);
  };

  return (
    <>
      {expanded ? `${children}  ` : `${children.substr(0, splitIndex)}  ...  `}
      <Link onClick={handleToggle}>{expanded ? moreLabel : lessLabel}</Link>
    </>
  );
};
