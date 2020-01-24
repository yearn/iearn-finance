import createBreakpoints from '@material-ui/core/styles/createBreakpoints'

export const colors = {
  white: "#fff",
  black: '#000',
  darkBlue: "#2c3b57",
  blue: "#426ed5",
  gray: "#e1e1e1",
  lightGray: "#fafafa",
  lightBlack: "#6a6a6a",
  darkBlack: "#141414",
  green: '#1abc9c',
  red: '#ed4337',
  orange: 'orange',
};

const breakpoints = createBreakpoints({
  keys: ["xs", "sm", "md", "lg", "xl"],
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1800
  }
})

const iswapTheme =  {
  typography: {
    fontFamily: ['Lato', 'Roboto', 'Open Sans', 'sans-serif'].join(","),
    lineHeight: 1.45,
    useNextVariants: true,
    h1: {
      fontSize: '1.0rem',
      fontWeight: 'bold',
      [breakpoints.up('md')]: {
        fontSize: '1.5rem',
      }
    },
    h2: {
      fontSize: '0.7rem',
      [breakpoints.up('md')]: {
        fontSize: '1rem',
      }
    },
    h3: {
      fontSize: '0.9rem',
      [breakpoints.up('md')]: {
        fontSize: '1.3rem',
      }
    },
    h4: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      [breakpoints.up('md')]: {
        fontSize: '2.4rem',
      }
    },
    h5: {
      fontSize: '0.7rem',
      [breakpoints.up('md')]: {
        fontSize: '1rem',
      }
    }
  },
  type: 'light',
  overrides: {
    MuiSelect: {
      selectMenu: {
        padding: '0px',
        minHeight: '72px'
      },
      select: {
        background: 'none !important',
      }
    },
    MuiInputBase: {
      root: {
        fontSize: '1.1rem',
        background: 'none',
        paddingRight: '10px',
        fontWeight: '600',
        [breakpoints.up('md')]: {
          fontSize: '1.3rem',
        }
      }
    },
    MuiInputLabel: {
      outlined: {
        transform: 'translate(16px, 21px) scale(1)',
        [breakpoints.up('md')]: {
          transform: 'translate(28px, 31px) scale(1)',
        }
      }
    },
    MuiFormLabel: {
      root: {
        fontSize: '1.1rem',
        [breakpoints.up('md')]: {
          fontSize: '1.3rem',
        }
      }
    },
    MuiOutlinedInput: {
      input: {
        padding: '18px',
        [breakpoints.up('md')]: {
          padding: '27px',
        }
      },
      notchedOutline: {
        borderRadius: '10px'
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
    },
    MuiSnackbar : {
      anchorOriginBottomLeft: {
        bottom: '50px',
        left: '80px',
        '@media (min-width: 960px)': {
          bottom: '50px',
          left: '80px'
        }
      }
    },
    MuiSnackbarContent: {
      root: {
        backgroundColor: colors.white,
        padding: '0px',
        minWidth: '450px',
        '@media (min-width: 960px)': {
          minWidth: '450px',
        }
      },
      message: {
        padding: '0px'
      },
      action: {
        marginRight: '0px'
      }
    },
    MuiDialogContent: {
      root: {
        padding: '0 12px 12px',
        '@media (min-width: 960px)': {
          padding: '0 24px 24px',
        }
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
  },
  breakpoints: breakpoints
};

export default iswapTheme;
