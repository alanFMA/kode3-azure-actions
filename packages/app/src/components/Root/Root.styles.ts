import styled from 'styled-components'


export const ExtendedSidebarGroup = styled.div `
  header {
    height: 80%;
    background-image: linear-gradient(to right, #368e77,#8bdfcf);
    &::after {
      content: url(https://kode3.tech/wp-content/themes/kode3/assets/img/profissionais_black_84dp.svg);
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
    button {
      color: #46bd9f;
      &:hover {
        background: none;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4)
      }
    }
  }
`

