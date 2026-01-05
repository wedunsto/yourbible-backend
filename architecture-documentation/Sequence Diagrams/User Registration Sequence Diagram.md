These sequence diagrams visually represents the user login data flow in the layered architecture

<u>Basic Happy Path Overview</u>:
```plantuml
@startuml
actor User
participant "Registration UI" as Register
participant Authentication
database "User Store" as Database

User -> Register : Enter credentials
Register -> Authentication : Request credential creation
Authentication -> Database : Create credentials
Authentication -> Register : Return credentials confirmation
Register -> User : Present screen based on results
@enduml

```

<u>Advanced Happy Path Overview</u>:
```plantuml
@startuml
actor User
participant "Registration UI" as Register
control AuthController
control AuthService
database "User Store" as Database

User -> Register : Enter credentials
Register -> AuthController : POST /users
AuthController -> AuthService : Call credential creation function
AuthService -> AuthService : Confirm username uniqueness
AuthService -> AuthService : Confirm password strength
AuthService -> AuthService : Hash credentials
AuthService -> Database : Create credentials entry
AuthService -> AuthController : Confirm credentials creation return 201
AuthController -> Register : Confirm credentials creation
Register -> User : Present login screen

@enduml

```