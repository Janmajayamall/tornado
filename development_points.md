##JWT:
1. jwt is stored in local async storage, and no where else. It is a single point of access. All the requests made to the server a already preloaded with jwt, it is present.
2. jwt is only manipulated post login or register

##Getting user_info
1. User_info is retrieved from a single query GET_USER_INFO. The cache mechansism takes care of faster retrieval of the user data on every request

##Input restrictions:
1. username_length:30
2. post_descrition:2000
3. Caption:2000
4. bio:150,
5. three words:40
