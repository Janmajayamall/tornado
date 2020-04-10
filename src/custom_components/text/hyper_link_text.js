import React from "react"
import {
    Linking,
    Text,
    View
} from "react-native"
import HyperLink from "react-native-hyperlink"
import PropTypes from "prop-types"

class HyperLinkText extends React.PureComponent{

    static propTypes = {
        style:PropTypes.any,
        trim:PropTypes.bool,

        //if trim is true, then numberOfLines is required
        numberOfLines:PropTypes.number

    }
    
    constructor(props){
        super(props)
        this.state={
            trimmed_state:true,
            read_more:false
        }
    }

    open_link = (url) => {
        console.log(url)
        try{
            Linking.openURL(url)
        }catch(e){
            console.log(`not able to open url: ${url} with error:\n ${e}`)
        }
    }   


    render(){

        //if trim is false
        if(!this.props.trim){
            <HyperLink
                onPress={(url)=>{this.open_link(url)}}
                linkStyle={{
                    color:"#00acee"
                }}
            >
                <Text                                     
                    style={[this.props.style, {textAlign:"left"}]}>
                    {this.props.children}
                </Text>
            </HyperLink>
        }

        //when trim is true
        return(
            <View>
                <HyperLink
                    onPress={(url)=>{this.open_link(url)}}
                    linkStyle={{
                        color:"#00acee"
                    }}
                >
                    {
                        this.state.trimmed_state ?
                            <Text 
                                style={[this.props.style, {textAlign:"left"}]}
                                numberOfLines={this.props.numberOfLines}
                                onTextLayout={(e)=>{
                                    if(e.nativeEvent.lines.length>=this.props.numberOfLines){
                                        this.setState({
                                            read_more:true
                                        })
                                    }
                                }}>
                                {this.props.children}
                            </Text>:
                            <Text 
                                style={{textAlign:"left", ...this.props.style}}>
                                {this.props.children}
                            </Text>
                    }
                </HyperLink>
                {
                    this.state.read_more ?
                        <Text 
                            onPress={()=>{this.setState({trimmed_state:false, read_more:false})}}
                            style={[this.props.style, {color:"#00acee"}]}>
                            Read more
                        </Text>:
                        undefined
                }
            </View>        
        )
    }
}

export default HyperLinkText