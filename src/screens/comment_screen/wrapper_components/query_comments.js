import React from "react"
import {

} from "react-native"
import {
    Query
} from "react-apollo"

//importing custom components
import CommentList from "../../../custom_components/comments/comment_list"

//importing queries
import {GET_POST_COMMENTS} from "./../../../apollo_client/apollo_queries/index"

const QueryComments = (props) => {
    return(
        <Query
            query={GET_POST_COMMENTS}
            variables={{
                content_id:props.post_object._id,
                content_type:props.post_object.post_type,
            }}
        >
            {({loading, error, data, refetch, networkStatus}) => {
                //TODO: You don't need this thing
                console.log(data, "ass")
                return(
                    <CommentList
                        comment_list={data ? data.get_post_comments : []}
                        post_object={props.post_object}
                        error={error}
                        loading={loading}
                        refresh_list={()=>{
                            refetch()
                        }}
                        network_status={networkStatus}
                        bottom_padding={props.bottom_padding}
                    />
                )

            }}
        </Query>
    )
}

export default React.memo(QueryComments)