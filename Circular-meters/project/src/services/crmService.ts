interface SatisfactionData {
  customerSatisfaction: number;
  resolutionSatisfaction: number;
}

export async function fetchSatisfactionRatings(): Promise<SatisfactionData> {
  console.log("🔄 Starting fetchSatisfactionRatings()...");
  debugger;

  try {
    // Get Xrm context
    const parentWindow = window.parent as any;
    if (!parentWindow || !parentWindow.Xrm) {
      throw new Error("Xrm not found in parent window.");
    }


    // Get Contact ID
    
    // const contactId = formContext.data?.entity?.getId?.()?.replace(/[{}]/g, "");
    // console.log("Contact ID:", contactId);

    // if (!contactId) {
    //   throw new Error("Contact ID not found in form context");
    // }


    let contactId = null;

 if (parentWindow.Xrm?.Page?.data?.entity) {
  console.log("Found Xrm.Page.data.entity");
  const entityName = parentWindow.Xrm.Page.data.entity.getEntityName();
  console.log("Entity name:", entityName);

  if (entityName === "new_survey") {
     const lookupValue = parentWindow.Xrm.Page.getAttribute("new_contacttosurveyid")?.getValue();

    if (lookupValue && lookupValue.length > 0) {
      contactId = lookupValue[0].id.replace(/[{}]/g, "");
      console.log("Contact ID from lookup:", contactId);
    } else {
      console.warn("Contact lookup is empty on Survey form.");
    }

  } else if (entityName === "contact") {
    // Case 2️: Inside Contact form → get current Contact ID
    contactId = parentWindow.Xrm.Page.data.entity.getId()?.replace(/[{}]/g, "") || null;
    console.log("Contact ID from Contact form:", contactId);
  } else {
    console.warn(`Unsupported entity: ${entityName}`);
  }
} else {
  console.warn("parentWindow.Xrm.Page.data.entity not found — not inside a form context.");
}

console.log("Final Contact ID value:", contactId);




    //  Get Xrm.WebApi
    const XrmWebApi = parentWindow.Xrm.WebApi;
    if (!XrmWebApi) {
      throw new Error("Xrm.WebApi not available.");
    }

    //Build query (confirm entity and lookup names)
    const entitySetName = "new_survey"; 
    const contactLookupField = "_new_contacttosurveyid_value";

    const query = `?$select=new_surveytypes,new_rating&$filter=${contactLookupField} eq ${contactId}`;
    console.log("Fetching surveys with query:", query);

    const result = await XrmWebApi.retrieveMultipleRecords(entitySetName, query);
    console.log("✅ CRM Query Result:", result);

    const customerRatings: number[] = [];
    const resolutionRatings: number[] = [];

    // Parse results
    result.entities.forEach((item: any) => {
      const surveyType = item.new_surveytypes;
      const surveyTypeLabel = item["new_surveytypes@OData.Community.Display.V1.FormattedValue"];
      const rating = item.new_rating || 0;

      // Handle numeric and label cases
      if (surveyType === 1 || surveyTypeLabel === "Customer Satisfaction") {
        customerRatings.push(rating);
      } else if (surveyType === 2 || surveyTypeLabel === "Resolution Satisfaction") {
        resolutionRatings.push(rating);
      }
    });

    // Calculate averages
    const avgCustomer =
      customerRatings.length > 0
        ? customerRatings.reduce((a, b) => a + b, 0) / customerRatings.length
        : 0;

    const avgResolution =
      resolutionRatings.length > 0
        ? resolutionRatings.reduce((a, b) => a + b, 0) / resolutionRatings.length
        : 0;

    console.log("Averages:", { avgCustomer, avgResolution });

    return {
      customerSatisfaction: avgCustomer,
      resolutionSatisfaction: avgResolution,
    };
  } catch (error: any) {
    console.error("Error fetching CRM data:", error);
    return {
      customerSatisfaction: 0,
      resolutionSatisfaction: 0,
    };
  }
}
