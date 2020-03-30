import React from "react"
import {
    Linking,
    Text
} from "react-native"
import HyperLink from "react-native-hyperlink"
import PropTypes from "prop-types"

class HyperLinkText extends React.PureComponent{

    static propTypes = {
        style:PropTypes.any
    }
    
    constructor(props){
        super(props)
        this.state={
            
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
        return(
            <HyperLink
                onPress={(url)=>{this.open_link(url)}}
                linkStyle={{
                    color:"#00acee"
                }}
            >
                <Text style={[this.props.style, {textAlign:"left"}]}>
                    {this.props.children}
                </Text>
            </HyperLink>
        )
    }
}

export default HyperLinkText