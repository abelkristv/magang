/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

interface StarRatingProps {
  count: number;
  value: number;
  onChange: (value: number) => void;
  hoverOn?: boolean;
}

const StarContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const starStyles = css`
  font-size: 2rem;
  cursor: pointer;
  color: #ccc;

  &.filled {
    color: gold;
  }
`;

const StarRating: React.FC<StarRatingProps> = ({ count, value, onChange, hoverOn=true }) => {
  const [hover, setHover] = useState<number | null>(null);

  const handleMouseOver = (index: number) => setHover(index);
  const handleMouseLeave = () => setHover(null);
  const handleClick = (index: number) => onChange(index);

  return (
    <StarContainer>
      {[...Array(count)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <span
            key={index}
            css={starStyles}
            className={ratingValue <= (hover || value) ? "filled" : ""}
            onMouseOver={() => hoverOn ? handleMouseOver(ratingValue) : {}}
            onMouseLeave={handleMouseLeave}
            onClick={() => hoverOn ? handleClick(ratingValue) : {}}
          >
            &#9733;
          </span>
        );
      })}
    </StarContainer>
  );
};

export default StarRating;
