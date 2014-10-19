---
layout: page
title: Date Specificity
---

## Date Specificity

When writing dates for provenance, it's important to state the level of accuracy desired.  The following phrasings for dates are preferred for each level of specificity:

*The gobbledygook is a formal specification of the form as a regular expression, and can be ignored by non-nerds.*

### Known to the Century

**Preferred Form:** 19th century, 1st century CE, 2nd century BCE

**Alternate Forms:** 20th Century ad, 19 Century, 4th century BC

    /\b(\d{1,2})(?:st|rd|th|nd)?\s+century(?:\s+(ad|bc|bce|ce))?\b/i



### Known to the Decade

**Preferred Form:** 1990s, 1520s

    /\b(\d{1,3})0s(?:\s+(?:ad|bc|bce|ce))?\b/i

Avoid using this for dates before 1000 CE.

### Known to the Year

**Preferred Form:** 1990, 900 CE, 800 BCE

**Alternate Forms:**  10 ad, 1 BC, 6000 BCE, 800

    /
      (?<!(?:january|febuary|october)\s) # ignore months...
      (?<!(?:march|april)\s)
      (?<!(?:june|july|sept)\s)
      (?<!(?:august)\s)
      (?<!(?:september)\s)
      (?<!(?:december|november|february)\s)
      (?<!(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s)
      (?<!(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\.\s) # ...lots of months, these ones with the dot
      (?<!\d,\s)  # preceding digit and comma, for jan 1, 2014, to ignore the 1
      (?<!\d\s)  # preceding digit, for jan 1 2014, to ignore the 1
      (?<!\d(?:st|rd|th|nd)\s)  # ordinal, for jan 1st 2014, to ignore the 1
      (?<!\d(?:st|rd|th|nd),\s)  # preceding digit, for jan 1st, 2014, to ignore the 1
      \b
      (\d{1,4}) # capture year
      (?:\s+(ad|bc|bce|ce))? # optionally capture era
      \b  
      (?!\scentury) # ignore centuries
    /ix

BCE is mandatory.  CE is mandatory when other dates within the record are BCE. CE is strongly preferred when the year is before 1000 CE.

#### Known to the Month

**Preferred Form:** October 1990
    
**Alternate Forms:** June 2000 CE, March 880, January 80, aug. 1995, August, 1995

    /\b
       (?:jan|january|feb|february|febuary|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|sept|september|oct|october|nov|november|dec|december)
       \.?,?    # possible punctuation
       \s       # and a space 
       \d{1,4}  # the year
       (?:\s+(ad|bc|bce|ce))?  # the optional era
       (?!,)       # skip it if it is followed by a comma , which might be a BAD IDEA. 
       (?!\s\d)    # skip it if it is followed by a digit
       \b
     /ix

#### Known to the Day

**Preferred Form:** June 11, 1995
 
**Alternate Forms:**  June 11 1995, Oct. 17, 1980, June 15, 90 BCE

    /\b
      (?:jan|january|feb|february|febuary|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|sept|september|oct|october|nov|november|dec|december)
      \.?,?\s\d{1,2}
      (?:st|rd|th|nd)?\s?
      ,?
      \s\d{1,4}
      (?:\s+(?:ad|bc|bce|ce))?\b
    /ix


#### Known to the Minute

*Are you kidding me? No.  We're not doing this.  Enter it to the day.*