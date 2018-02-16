package es.weso.utils
import org.apache.commons.text.StringEscapeUtils

object StrUtils {

  /**
    * Unscape unicode numbers
    * Given a string like: "p\u0031", return "p1"
    * @param str input string
    * @return unscaped output string
    */
  def unescape(str: String): String = {

    // I will probably need to use other ways to unescape the string.
    // Some code I found in google: http://techidiocy.com/replace-unicode-characters-from-java-string/
    // https://udojava.com/2013/09/28/unescape-a-string-that-contains-standard-java-escape-sequences/

    // I will need to implement the following escape sequences: https://www.w3.org/TR/turtle/#sec-escapes
    // The following code doesn't handle uppercase \U
    StringEscapeUtils.unescapeJava(str)

  }

}