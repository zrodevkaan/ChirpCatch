import Webpack from "../webpack";

export const Dropdown = ({
                      options = [],
                      placeholder = "Select an option",
                      onSelect = () => {
                      },
                      className = ""
                  }) => {
    const useState = Webpack.React.useState;

    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
        onSelect(option);
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return Webpack.React.createElement('div', {
            className: `relative inline-block w-64 ${className}`,
            style: {
                position: 'relative',
                display: 'inline-block',
                width: '16rem'
            }
        },
        Webpack.React.createElement('button', {
                onClick: toggleDropdown,
                style: {
                    width: '100%',
                    padding: '8px 16px',
                    textAlign: 'left',
                    backgroundColor: 'transparent',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    cursor: 'pointer'
                }
            },
            Webpack.React.createElement('span', {
                style: {
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }
            }, selectedOption ? selectedOption.label : placeholder),
            Webpack.React.createElement('span', {
                    style: {
                        position: 'absolute',
                        top: '0',
                        right: '0',
                        bottom: '0',
                        display: 'flex',
                        alignItems: 'center',
                        paddingRight: '8px',
                        pointerEvents: 'none'
                    }
                },
                Webpack.React.createElement('svg', {
                        style: {
                            width: '20px',
                            height: '20px',
                            color: '#9ca3af',
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s'
                        },
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24"
                    },
                    Webpack.React.createElement('path', {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M19 9l-7 7-7-7"
                    })
                )
            )
        ),
        isOpen && Webpack.React.createElement('div', {
                style: {
                    position: 'absolute',
                    zIndex: 10,
                    width: '100%',
                    marginTop: '4px',
                    backgroundColor: 'black',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }
            },
            Webpack.React.createElement('ul', {
                    style: {
                        maxHeight: '15rem',
                        overflowY: 'auto',
                        margin: 0,
                        padding: 0,
                        listStyle: 'none'
                    }
                },
                options.map((option, index) =>
                    Webpack.React.createElement('li', {
                        key: option.value || index,
                        onClick: () => handleOptionClick(option),
                        style: {
                            padding: '8px 16px',
                            cursor: 'pointer',
                            userSelect: 'none'
                        },
                        onMouseEnter: (e) => {
                            e.target.style.backgroundColor = '#f3f4f6';
                        },
                        onMouseLeave: (e) => {
                            e.target.style.backgroundColor = 'transparent';
                        }
                    }, option.label)
                )
            )
        )
    );
};