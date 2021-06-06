import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    ScrollView,
    Dimensions
} from "react-native";

const { width, height } = Dimensions.get("window");
const MARGIN = {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
}
const HEADER = {
    HEIGHT: 36,
    BORDER_RADIUS: 4,
}

export default class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            active: 0,
            translateX: new Animated.Value(0), // For the sliding button
            tabs: [
                {
                    header: <Text>Tab 0</Text>,
                    content: (
                        <React.Fragment>
                            <Text>Tab 0</Text>
                            <View style={{ marginTop: MARGIN.marginTop }}>
                                <Text>Tab 0 content</Text>
                            </View>
                        </React.Fragment>
                    ),
                },
                {
                    header: <Text>Tab 1</Text>,
                    content: (
                        <React.Fragment>
                            <Text>Tab 1</Text>
                            <View style={{ marginTop: MARGIN.marginTop }}>
                                <Text>Tab 1 content</Text>
                            </View>
                        </React.Fragment>
                    ),
                },
                {
                    header: <Text>Tab 2</Text>,
                    content: (
                        <React.Fragment>
                            <Text>Tab 2</Text>
                            <View style={{ marginTop: 20 }}>
                                <Text>Tab 2 content</Text>
                            </View>
                        </React.Fragment>
                    ),
                }
            ]
        };


    }


    handleSlide = x => {
        let {
            active,
            translateX,
            tabs,
        } = this.state;

        // Move the slider button
        Animated.spring(translateX, {
            toValue: x,
            duration: 100
        }).start();

        // Loop through tabs
        Animated.parallel(
            tabs.map((tab,i)=>(
                Animated.spring(tab.translateX, {
                    toValue: width * (i-active),
                    duration: 100
                }).start())
            )
        )

        // No need for setState or forceUpdate since we call Animated to
        // change the translateX value.
    };
    getBorderStyle(i){
        const {tabs} = this.state;
        if (i === 0){ // Left-most item
            return {
                borderTopLeftRadius: HEADER.BORDER_RADIUS,
                borderBottomLeftRadius: HEADER.BORDER_RADIUS,
            }
        }
        if (i === tabs.length - 1){ // Right-most item
            return {
                borderTopRightRadius: HEADER.BORDER_RADIUS,
                borderBottomRightRadius: HEADER.BORDER_RADIUS,
            }
        }

    }

    render() {
        let {
            translateX,
            active,
            tabs,
        } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <View
                    style={{
                        ...MARGIN,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            marginBottom: MARGIN.marginBottom,
                            height: HEADER.HEIGHT,
                            position: "relative"
                        }}
                    >
                        <Animated.View
                            style={{
                                position: "absolute",
                                width: `${100/tabs.length}%`,
                                height: "100%",
                                top: 0,
                                left: 0,
                                backgroundColor: "#007aff",
                                transform: [
                                    {
                                        translateX
                                    }
                                ],
                                ...(this.getBorderStyle(active)),
                            }}
                        />
                        {
                            tabs.map((tab,i)=>{

                                // Get the header data
                                const {header} = tab;
                                // Render the header
                                return (
                                    <TouchableOpacity
                                        // Key should normally not be the
                                        // index!! Note that this is OK for
                                        // this tab bar if the tabs do not
                                        // shift around.
                                        // See React rendering
                                        // documentation: https://reactjs.org/docs/reconciliation.html#keys
                                        key={i}

                                        style={{
                                            flex: 1,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            borderWidth: 1,
                                            borderColor: "#007aff",
                                            ...(this.getBorderStyle(i)),
                                        }}

                                        onLayout={event =>{
                                            // Set the x position
                                            tabs[i].x = event.nativeEvent.layout.x;
                                            // No need to rerender using
                                            // setState or forceUpdate
                                        }}
                                        onPress={() =>
                                            this.setState({ active: i }, () =>
                                            {
                                                this.handleSlide(tabs[i].x);
                                            })
                                        }
                                    >
                                        <View
                                            style={{
                                                color: active === i ? "#fff" : "#007aff"
                                            }}
                                        >
                                            {header}
                                        </View>
                                    </TouchableOpacity>
                                )
                            })

                        }
                    </View>

                    <ScrollView
                        style={{
                            // Relative anchor for child screens
                            position: 'relative',
                            display: 'flex',
                            height: height - HEADER.HEIGHT - (MARGIN.marginTop
                                                              + MARGIN.marginBottom
                                                              + MARGIN.marginBottom),
                        }}
                    >
                        {tabs.map((tab,i)=>{
                            // Destructure content
                            const {content, translateX} = tab;


                            // Render the tab content
                            return (
                                <Animated.View
                                    // Same with the tab header, see note
                                    // on keys above
                                    key={i}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        flex: 1,
                                        width: '100%',
                                        // height: '100%',
                                        justifyContent: "center",
                                        alignItems: "center",

                                        transform: [
                                            {
                                                translateX: translateX ? translateX : width,
                                            }
                                        ]
                                    }}
                                    onLayout={event =>{
                                        // Set the x position
                                        tabs[i].translateX = new Animated.Value(width*i);
                                        this.forceUpdate();
                                    }}
                                >
                                    {content}
                                </Animated.View>
                            )
                        })}
                    </ScrollView>
                </View>
            </View>
        );
    }
}
