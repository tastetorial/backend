export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED',
}

export enum UserRole {
    ADMIN = "admin",
    CREATOR = "creator",
    VIEWER = "viewer"
}


export enum ReactionType {
    LIKE = 'like',
    RATING = 'rating'
}

export enum VideoStatus {
    PUBLISHED = 'published',
    DRAFT = 'draft',
    ARCHIVED = 'archived'
}

export enum CreatorStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    DECLINED = 'declined',
    REVOKED = 'revoked',
    SUSPENDED = 'suspended'
}

export enum OTPType {
    EMAIL = 'email',
    PHONE = 'phone'
}

export enum OTPReason {
    FORGOT_PASSWORD = 'forgot_password',
    VERIFY_EMAIL = 'verify_email',
}