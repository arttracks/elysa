---
layout: page
title: External Date Resources
---

This is a useful collection of links and papers describing some of the research that was used when developing this library.
Some of it is very CIDOC-CRM, some of it is generic time-based information.   More to be added as I learn more.

#### [c code for time mapping](http://www.cidoc-crm.org/downloads/CIDOC-CRM_temporal_representation.pdf)

Really clever library for representing and searching within time, using the AAT codes.  Allows fuzzy search, uses Allen operators.

[Code (zip)](http://www.cidoc-crm.org/downloads/time_primitive_c_library_1.0.zip)

#### [Linking Open Descriptions of Events (PDF)](http://oai.cwi.nl/oai/asset/14783/14783A.pdf/)

#####Abstract
> 
People conventionally refer to an action or occurrence taking place at a certain time at a specific location as an event. This notion is potentially useful for connecting individual facts recorded in the rapidly growing collection of linked data sets and for discovering more complex relationships between data. In this paper, we provide an overview and comparison of existing event models, looking at the different choices they make of how to represent events. We describe a model for publishing records of events as Linked Data. We present tools for populating this model and a prototype “event directory” web service, which can be used to locate stable URIs for events that have occurred, provide RDFS+OWL descriptions and link to related resources.


#### [Linked Data design pattern: date recording](http://light.demon.co.uk/wordpress/?p=600)

This is a discussion of the various XML date patterns, and a suggestion of a formalized method of implementing them.  Brief, somewhat definitive.

Mentions the following:

* "1686-12-10"^^xsd:date
* "1686-12"^^xsd:gYearMonth,
* "1686"^^xsd:gYear 

Suggests using `[E2_Temporal_Entity]` for dates...

Suggests using the `[crm:E2_Temporal_Entity, crm:P82_at_some_time_within, "1686"^^xsd:gYear]` pattern for single-year dates.

#### [How to Implement CRM Time in RDF (PDF)](http://www.cidoc-crm.org/docs/How_to%20implement%20CRM_Time_in%20RDF.pdf)

This is a brief overview of how the  begin-of-the-begin and end-of-the-end system works as an extension of the **CIDOC-CRM**.

#### [A brief explanation of time (doc)](http://www.cidoc-crm.org/docs/frbr_oo/frbr_docs/meeting_presentations/10th_meeting_presentations/Allen%20Operators.doc)

This is a document on Allen Operators, which are the mathematical concept that the **CIDOC-CRM** event model is based on.

#### [An Interval Algebra for Indeterminate Time (ps)](http://www.cidoc-crm.org/docs/aaai2000.ps)

A research paper on the math behind analyzing dates. Even more math-heavy—heavy enough that I don't really understand it.

#### [Date & Time Formats on the Web](http://www.hackcraft.net/web/datetime/)

A huge discussion of available web formats for dates.  Not RDF-specfic, but gives a good overview of the sorts of complications with digital dates.


#### Papers (That I haven't found yet)

* Deducing event chronology in a cultural heritage documentation system (Holmen & Ore, CAA 2009) 
    An in-depth discussion of the 4-dates model 
* Implementing archaeological time periods using CIDOC CRM and SKOS (Binding, ESWC2010) 
* STAR STELLAR has made a catalog of periods but I think it's more focused on relatively recent times (Tudor, Victorian, etc). 
