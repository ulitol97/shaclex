package es.weso.shapeMaps

import es.weso.rdf.nodes.{ IRI, RDFNode }
import io.circe.{ Encoder, Json, JsonObject }
import io.circe.syntax._

abstract class NodeSelector {
  def toJson: Json = this match {
    case RDFNodeSelector(node) => Json.fromString(node.toString)
    case TriplePattern(subj, predicate, obj) => ???
  }
}
case class RDFNodeSelector(node: RDFNode) extends NodeSelector
case class TriplePattern(subjectPattern: Pattern, predicate: IRI, objectPattern: Pattern) extends NodeSelector

object NodeSelector {
  implicit val encodeNodeSelector: Encoder[NodeSelector] = new Encoder[NodeSelector] {
    final def apply(nodeSelector: NodeSelector): Json = {
      nodeSelector match {
        case RDFNodeSelector(node) => Json.fromString(node.toString)
        case TriplePattern(subj, pred, obj) => {
          Json.fromJsonObject(JsonObject.empty.
            add("subject", subj.asJson).
            add("predicate", Json.fromString(pred.toString)).
            add("object", obj.asJson))
        }
      }
    }
  }
}