export const colors = {
  white: "#fff",
  black: '#000',
  darkBlue: "#2c3b57",
  blue: "#426ed5",
  gray: "#e1e1e1",
  lightGray: "#fafafa",
  lightBlack: "#6a6a6a",
  darkBlack: "#141414"
};

const iearnTheme =  {
  typography: {
    fontFamily: ['Lato', 'Roboto', 'Open Sans', 'sans-serif'].join(","),
    lineHeight: 1.45,
    useNextVariants: true,
    h1: {
      fontSize: '1.5rem',
      fontWeight: 'bold'
    },
    h2: {
      fontSize: '1rem'
    },
    h3: {
      fontSize: '1.3rem'
    },
    h4: {
      fontSize: '2.4rem',
      fontWeight: 'bold'
    },
    h5: {
      fontSize: '1rem'
    }
  },
  type: 'light',
  overrides: {
    MuiSelect: {
      select: {
        background: 'none !important',
      }
    },
    MuiInputBase: {
      root: {
        fontSize: '13px',
        background: 'none',
        padding: '4px 12px'
      }
    },
    MuiOutlinedInput: {
      input: {
        padding: '14px'
      }
    },
    MuiPrivateNotchedOutline: {
      root: {
      }
    },
    MuiButton: {
      label: {
        fontSize: '0.7rem',
        textTransform: 'none'
      }
    }
  },
  palette: {
    primary: {
      main: colors.blue
    },
    secondary: {
      main: colors.white
    },
    background:{
      paper: colors.white,
      default: colors.white
    },
    text: {
      primary: colors.lightBlack,
    }
  }
};

export default iearnTheme;
