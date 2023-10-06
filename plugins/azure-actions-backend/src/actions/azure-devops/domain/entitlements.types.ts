
/** License assigned to a user */
export interface AccessLevel {
  /** Type of Account License (e.g. Express, Stakeholder etc.) */
  accountLicenseType: AccountLicenseType
  /** Assignment Source of the License (e.g. Group, Unknown etc. */
  assignmentSource: AssignmentSource
  /** Display name of the License */
  licenseDisplayName: string
  /** Licensing Source (e.g. Account. MSDN etc.) */
  licensingSource: LicensingSource
  /** Type of MSDN License (e.g. Visual Studio Professional, Visual Studio Enterprise etc.) */
  msdnLicenseType: MsdnLicenseType
  /** User status in the account */
  status: AccountUserStatus
  /** Status message. */
  statusMessage: string
}

/** Type of Account License (e.g. Express, Stakeholder etc.) */
export interface AccountLicenseType {
  /** 	 */
  advanced: string
  /** 	 */
  earlyAdopter: string
  /** 	 */
  express: string
  /** 	 */
  none: string
  /** 	 */
  professional: string
  /** 	 */
  stakeholder: string
}

/** User status in the account */
export interface AccountUserStatus {
  /** User has signed in at least once to the VSTS account */
  active: string
  /** User is removed from the VSTS account by the VSTS account admin */
  deleted: string
  /** User cannot sign in; primarily used by admin to temporarily remove a user due to absence or license reallocation */
  disabled: string
  /** User can sign in; primarily used when license is in expired state and we give a grace period */
  expired: string
  /** 	 */
  none: string
  /** User is invited to join the VSTS account by the VSTS account admin, but has not signed up/signed in yet */
  pending: string
  /** User is disabled; if reenabled, they will still be in the Pending state */
  pendingDisabled: string
}

/** Assignment Source of the License (e.g. Group, Unknown etc. */
export interface AssignmentSource {
  /** 	 */
  groupRule: string
  /** 	 */
  none: string
  /** 	 */
  unknown: string
}

/** Graph group entity */
export interface GraphGroup {
  /** This field contains zero or more interesting links about the graph subject. These links may be invoked to obtain additional relationships or more detailed information about this graph subject. */
  _links: ReferenceLinks
  /** A short phrase to help human readers disambiguate groups with similar names */
  description: string
  /** The descriptor is the primary way to reference the graph subject while the system is running. This field will uniquely identify the same graph subject across both Accounts and Organizations. */
  descriptor: string
  /** This is the non-unique display name of the graph subject. To change this field, you must alter its value in the source provider. */
  displayName: string
  /** This represents the name of the container of origin for a graph member. (For MSA this is "Windows Live ID", for AD the name of the domain, for AAD the tenantID of the directory, for VSTS groups the ScopeId, etc) */
  domain: string
  /** [Internal Use Only] The legacy descriptor is here in case you need to access old version IMS using identity descriptor. */
  legacyDescriptor: string
  /** The email address of record for a given graph member. This may be different than the principal name. */
  mailAddress: string
  /** The type of source provider for the origin identifier (ex:AD, AAD, MSA) */
  origin: string
  /** The unique identifier from the system of origin. Typically a sid, object id or Guid. Linking and unlinking operations can cause this value to change for a user because the user is not backed by a different provider and has a different unique id in the new provider. */
  originId: string
  /** This is the PrincipalName of this graph member from the source provider. The source provider may change this field over time and it is not guaranteed to be immutable for the life of the graph member by VSTS. */
  principalName: string
  /** This field identifies the type of the graph subject (ex: Group, Scope, User). */
  subjectKind: string
  /** This url is the full route to the source resource of this graph subject. */
  url: string
}

/** Graph user entity */
export interface GraphUser {
  /** This field contains zero or more interesting links about the graph subject. These links may be invoked to obtain additional relationships or more detailed information about this graph subject. */
  _links: ReferenceLinks
  /** The descriptor is the primary way to reference the graph subject while the system is running. This field will uniquely identify the same graph subject across both Accounts and Organizations. */
  descriptor: string
  /** The short, generally unique name for the user in the backing directory. For AAD users, this corresponds to the mail nickname, which is often but not necessarily similar to the part of the user's mail address before the @ sign. For GitHub users, this corresponds to the GitHub user handle. */
  directoryAlias: string
  /** This is the non-unique display name of the graph subject. To change this field, you must alter its value in the source provider. */
  displayName: string
  /** This represents the name of the container of origin for a graph member. (For MSA this is "Windows Live ID", for AD the name of the domain, for AAD the tenantID of the directory, for VSTS groups the ScopeId, etc) */
  domain: string
  /** When true, the group has been deleted in the identity provider */
  isDeletedInOrigin: boolean
  /** [Internal Use Only] The legacy descriptor is here in case you need to access old version IMS using identity descriptor. */
  legacyDescriptor: string
  /** The email address of record for a given graph member. This may be different than the principal name. */
  mailAddress: string
  /** The meta type of the user in the origin, such as "member", "guest", etc. See UserMetaType for the set of possible values. */
  metaType: string
  /** The type of source provider for the origin identifier (ex:AD, AAD, MSA) */
  origin: string
  /** The unique identifier from the system of origin. Typically a sid, object id or Guid. Linking and unlinking operations can cause this value to change for a user because the user is not backed by a different provider and has a different unique id in the new provider. */
  originId: string
  /** This is the PrincipalName of this graph member from the source provider. The source provider may change this field over time and it is not guaranteed to be immutable for the life of the graph member by VSTS. */
  principalName: string
  /** This field identifies the type of the graph subject (ex: Group, Scope, User). */
  subjectKind: string
  /** This url is the full route to the source resource of this graph subject. */
  url: string
}

/** Project Group (e.g. Contributor, Reader etc.) */
export interface Group {
  /** Display Name of the Group */
  displayName: string
  /** Group Type */
  groupType: GroupType
}

/** A group entity with additional properties including its license, extensions, and project membership */
export interface GroupEntitlement {
  /** Member reference. */
  group: GraphGroup
  /** The unique identifier which matches the Id of the GraphMember. */
  id: string
  /** [Readonly] The last time the group licensing rule was executed (regardless of whether any changes were made). */
  lastExecuted: string
  /** License Rule. */
  licenseRule: AccessLevel
  /** Group members. Only used when creating a new group. */
  members: UserEntitlement[]
  /** Relation between a project and the member's effective permissions in that project. */
  projectEntitlements: ProjectEntitlement[]
  /** The status of the group rule. */
  status: GroupLicensingRuleStatus
}

/** The status of the group rule. */
export interface GroupLicensingRuleStatus {
  /** Rule is applied */
  applied: string
  /** Rule is created or updated, but apply is pending */
  applyPending: string
  /** The group rule was incompatible */
  incompatible: string
  /** Rule failed to apply unexpectedly and should be retried */
  unableToApply: string
}

/** Group Type */
export interface GroupType {
  /** 	 */
  custom: string
  /** 	 */
  projectAdministrator: string
  /** 	 */
  projectContributor: string
  /** 	 */
  projectReader: string
  /** 	 */
  projectStakeholder: string
}

/** Licensing Source (e.g. Account. MSDN etc.) */
export interface LicensingSource {
  /** 	 */
  account: string
  /** 	 */
  auto: string
  /** 	 */
  msdn: string
  /** 	 */
  none: string
  /** 	 */
  profile: string
  /** 	 */
  trial: string
}

/** Type of MSDN License (e.g. Visual Studio Professional, Visual Studio Enterprise etc.) */
export interface MsdnLicenseType {
  /** 	 */
  eligible: string
  /** 	 */
  enterprise: string
  /** 	 */
  none: string
  /** 	 */
  platforms: string
  /** 	 */
  premium: string
  /** 	 */
  professional: string
  /** 	 */
  testProfessional: string
  /** 	 */
  ultimate: string
}

/** A page of users */
export interface PagedGraphMemberList {
  /** A user entity with additional properties including their license, extensions, and project membership */
  members: UserEntitlement[]
}

/** Relation between a project and the user's effective permissions in that project. */
export interface ProjectEntitlement {
  /** Assignment Source (e.g. Group or Unknown). */
  assignmentSource: AssignmentSource
  /** Project Group (e.g. Contributor, Reader etc.) */
  group: Group
  /** Whether the user is inheriting permissions to a project through a Azure DevOps or AAD group membership. */
  projectPermissionInherited: ProjectPermissionInherited
  /** Project Ref */
  projectRef: ProjectRef
  /** Team Ref. */
  teamRefs: TeamRef[]
}

/** Whether the user is inheriting permissions to a project through a Azure DevOps or AAD group membership. */
export interface ProjectPermissionInherited {
  /** 	 */
  inherited: string
  /** 	 */
  notInherited: string
  /** 	 */
  notSet: string
}

/** A reference to a project */
export interface ProjectRef {
  /** Project ID. */
  id: string
  /** Project Name. */
  name: string
}

/** The class to represent a collection of REST reference links. */
export interface ReferenceLinks {
  /** The readonly view of the links. Because Reference links are readonly, we only want to expose them as read only. */
  links: object
}

/** A reference to a team */
export interface TeamRef {
  /** Team ID */
  id: string
  /** Team Name */
  name: string
}

/** A user entity with additional properties including their license, extensions, and project membership */
export interface UserEntitlement {
  /** User's access level denoted by a license. */
  accessLevel: AccessLevel
  /** [Readonly] Date the user was added to the collection. */
  dateCreated: string
  /** [Readonly] GroupEntitlements that this user belongs to. */
  groupAssignments: GroupEntitlement[]

  /** The unique identifier which matches the Id of the Identity associated with the GraphMember. */
  id: string
  /** [Readonly] Date the user last accessed the collection. */
  lastAccessedDate: string
  /** Relation between a project and the user's effective permissions in that project. */
  projectEntitlements: ProjectEntitlement[]
  /** User reference. */
  user: GraphUser
}

/** Comma (",") separated list of properties to select in the result entitlements. names of the properties are - 'Projects, 'Extensions' and 'Grouprules'. */
export interface UserEntitlementProperty {
  /** 	 */
  all: string
  /** 	 */
  extensions: string
  /** 	 */
  groupRules: string
  /** 	 */
  license: string
  projects: string

}