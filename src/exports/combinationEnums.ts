export enum RuleQuantifier {
    // Existential quantifiers
    Exclude,
    IncludeOne,
    IncludeMany,
    // Universal quantifiers
    IncludeEverywhere,
    ExcludeEverywhere,
}

export enum RuleCondition {
    IfTypeDirectlyAboveType,
    IfType,
    IfStackLength,
}

export enum RuleCoverage {
    CheckAtIndices,
    CheckAtFirst,
    CheckAtLast,
    CheckEverywhere,
    CheckMeta,
}

export enum RuleRelationalOperator {
    GreaterThan,
    EqualTo,
    LesserThan,
}