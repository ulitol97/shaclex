package es.weso.rdf.nodes

import cats.implicits._
import java.net.{URI, URISyntaxException}

import cats.Show

import scala.util.Try
import scala.util.matching.Regex

case class IRI(uri: URI) extends RDFNode {

  def add(str: String): IRI = {
    IRI(uri.toString + str)
  }

  def +(str: String): IRI = {
    add(str)
  }

  override def toString = {
    "<" + uri.toString + ">"
  }

  implicit def minOrd = new Ordering[IRI] {
    def compare(a: IRI, b: IRI) = a.uri.compareTo(b.uri)
  }

  def str: String = {
    uri.toString
  }

  /**
   * Resolve an IRI against this IRI (which is taken as the base)
   * Currently, we employ java.net.URI algorithm to resolve
   */
  def resolve(iri: IRI): IRI = {
    IRI(uri.resolve(iri.uri))
  }

  override def getLexicalForm: String = {
    str
  }

  def isEmpty: Boolean = this == IRI("")

  def isEqualTo(other: RDFNode): Boolean = other match {
    case i: IRI => i.uri == uri
    case _ => false
  }

  def lessThan(other: RDFNode): Boolean = throw new Exception("Unimplemented lessThan")

}

object IRI {

  /**
   * Unsafe can raise an exception if the URI is not well formed
   * @param str
   * @return
   */
  def apply(str: String): IRI = {
    IRI(new URI(str))
  }

  def fromString(str: String, base: Option[IRI] = None): Either[String,IRI] = {
    Try{
      val uri = new URI(str)
      IRI(base.fold(uri)(_.uri.resolve(uri)))
    }.toEither.leftMap(_.getMessage)
  }

  def unapply(str: String): Option[IRI] =
    fromString(str).fold(_ => None, Some(_))

  lazy val iriRegex: Regex = "^(.*)$".r

  def parseIRI(str: String): Either[String, IRI] =
    str match {
      case iriRegex(i) => // TODO: Substitute by IRI.fromString(i)
        try {
          Right(IRI(i))
        } catch {
          case e: URISyntaxException =>
            Left(s"Error trying to parse IRI: $e, '$str'")
        }
      case _ =>
        Left(s"$str doesn't match IRI regex $iriRegex")
    }

  implicit val iriShow = Show.show[IRI] { _.toString }

}
