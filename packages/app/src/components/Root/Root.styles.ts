import styled from 'styled-components'
import Foguete from '../../assets/foguete.svg'

export const ExtendedSidebarGroup = styled.div `
  header {
    height: 80%;
    background-image: linear-gradient(to right, #368e77,#8bdfcf);
    &::after {
      content: url(${Foguete});
    }
  }
  main {
    a {
      &:hover {
        filter: brightness(0.8);
        font-weight: bold;
      }
      span {
        background-color: #46bd9f;
        &:nth-child(1) {
          z-index: 1;
        }
      }
    }
    circle {
      background-color: #46bd9f !important;
    }
    button + button {
        background-color: #46bd9f;
      &:hover {
        background-color: #46bd9f;
        filter: brightness(0.8);
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
      }
    }
  }
`