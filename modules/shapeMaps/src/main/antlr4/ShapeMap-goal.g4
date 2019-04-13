pair shapeAssociation
nodeSelector nodeSpec
statusAndShape + shapeSelector ⟼ shapeSpec

shapeMap         : shapeAssociation (',' shapeAssociation)* ;
shapeAssociation : nodeSpec shapeSpec reason? jsonAttributes? ;
nodeSpec         : objectTerm | triplePattern | extended ;
subjectTerm      : nodeIri ;
objectTerm       : subjectTerm | literal ;
triplePattern    : '{' KW_FOCUS path (objectTerm | '_' ) '}' # focusSubject
                 | '{' (subjectTerm | '_') path KW_FOCUS '}' # focusObject
                 ;
shapeSpec        : '@' status? (shapeIri | KW_START)
                 | AT_START
                 | ATPNAME_NS
                 | ATPNAME_LN
                 ;
literal          : rdfLiteral | numericLiteral | booleanLiteral ;
rdfLiteral       : string ( // LANGTAG |     # Remove support for language tagged literals by now
                           '^^' datatype)? ;
numericLiteral   : INTEGER | DECIMAL | DOUBLE ;
booleanLiteral   : KW_TRUE | KW_FALSE ;
string           : STRING_LITERAL1 | STRING_LITERAL_LONG1
                 | STRING_LITERAL2 | STRING_LITERAL_LONG2 ;
// TODO: add langString
// langString       : LANG_STRING_LITERAL1 | LANG_STRING_LITERAL_LONG1
//                  | LANG_STRING_LITERAL2 | LANG_STRING_LITERAL_LONG2

// BNF: predicate ::= iri | RDF_TYPE
predicate        : nodeIri | rdfType ;
rdfType		 : RDF_TYPE ;
datatype         : nodeIri ;
nodeIri          : IRIREF | prefixedName ;
shapeIri         : IRIREF | prefixedName ;
prefixedName     : PNAME_LN | PNAME_NS ;
blankNode        : BLANK_NODE_LABEL ;

extended         : (KW_SPARQL | nodeIri) string ;

// TODO: Check why the spec has iri instead of predicate
status           : negation | questionMark ;
reason           : '/' string ;
jsonAttributes   : '$' ; // TODO

// SPARQL Grammar rule 82
path             : pathAlternative ;

pathAlternative  : pathSequence ( '|' pathSequence ) *
                 ;

pathSequence     : pathEltOrInverse ( '/' pathEltOrInverse ) *
                 ;

pathEltOrInverse : pathElt | inverse pathElt
                 ;

inverse          : '^'
                 ;

pathElt          : pathPrimary pathMod?
                 ;

// Todo: Add pathNegatedPrimarySet
pathPrimary      : nodeIri | rdfType | '(' path ')'
                 ;

// Todo: Add integer ranges
pathMod          : '*'    # star
                 | '?'    # optional
                 | '+'    # plus
                 ;

//shapeLabel      : '@' negation? (nodeIri | KW_START)
//                | AT_START ;

negation        : KW_NOT | '!' ;
questionMark    : '?' ;

