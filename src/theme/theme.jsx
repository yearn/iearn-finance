import createBreakpoints from '@material-ui/core/styles/createBreakpoints'

export const colors = {
  white: "#fff",
  black: '#000',
  darkBlue: "#2c3b57",
  blue: "#2F80ED",
  gray: "#e1e1e1",
  lightGray: "#737373",
  lightBlack: "#6a6a6a",
  darkBlack: "#141414",
  green: '#1abc9c',
  red: '#ed4337',
  orange: 'orange',
  pink: '#DC6BE5',
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
    fontFamily: ['Open Sans', 'sans-serif'].join(","),
    lineHeight: '1rem',
    fontWeight: '700',
    useNextVariants: true,
    h1: {
      fontSize: '1.0rem',
      fontWeight: 'bold',
      [breakpoints.up('md')]: {
        fontSize: '1.5rem',
      }
    },
    h2: {
      fontSize: '1rem',
      fontWeight: '700',
    },
    h3: {
      fontSize: '1rem',
      fontWeight: '700',
    },
    h4: {
      fontSize: '0.75rem',
      fontWeight: '700',
    },
    h5: {
      fontSize: '0.8rem',
      fontWeight: '500',
      color: 'rgb(115, 115, 115);',
    },
    h6: {
      fontSize: '0.825rem',
      color: '#DC6BE5',
    },
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
        color: '#010101',
        fontSize: '1.5rem',
        background: 'none',
        paddingRight: '10px',
        fontWeight: '600',
        borderRadius: '1.25rem',
        backgroundColor: '#FFFFFF',
        [breakpoints.up('md')]: {
          fontSize: '1.5rem',
        }
      }
    },
    MuiExpansionPanel: {
      root: {
        padding: '10px',
        marginTop: '10px',
        '&:before': {
          display: 'none',
        },
        borderRadius: '20px',
        backgroundColor: 'white',
      },
      rounded: {
        //borderRadius: '20px',
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
        padding: '20px',
        [breakpoints.up('md')]: {
          padding: '20px',
        }
      },
      notchedOutline: {
        borderRadius: '1.25rem',
      }
    },
    MuiPrivateNotchedOutline: {
      root: {
      }
    },
    MuiButton: {
      label: {
        fontSize: '1rem',
        fontWeight: '700',
        textTransform: 'none'
      },
      outlined: {
        fontWeight: '700',
        fontSize: '1rem',
        minWidth: '250px'
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
      main: colors.blue,
      contrastText: colors.white
    },
    secondary: {
      main: colors.blue
    },
    background:{
      paper: colors.white,
      default: colors.white
    },
    text: {
      primary: colors.pink
    }
  },
  breakpoints: breakpoints
};

export default iswapTheme;
