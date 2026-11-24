const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString();
const daysAhead = (n) => new Date(Date.now() + n * 86400000).toISOString();
const today = () => new Date().toISOString();

export const mockUser = {
    id: "u1",
    name: "Alex Carter",
    email: "alex@timetoprogram.com",
    role: "owner",
    company: "Dealora",
    avatar: "",
    createdAt: daysAgo(240),
};

export const makeLeads = () => [
    lead(
        "l1",
        "Dribbble Design",
        "Acme Corp",
        "New",
        "High",
        "Website",
        89345,
        8,
    ),
    lead(
        "l2",
        "Google Pay",
        "Globex",
        "Qualified",
        "High",
        "Referral",
        124000,
        20,
    ),
    lead(
        "l3",
        "Amazon Shopping",
        "Initech",
        "Proposal",
        "Medium",
        "Cold Outreach",
        32123,
        35,
    ),
    lead("l4", "Stripe", "Umbrella Co", "Won", "High", "Event", 76500, 60),
    lead("l5", "Notion", "Soylent", "New", "Low", "Social", 12400, 4),
    lead("l6", "Figma", "Hooli", "Qualified", "Medium", "Website", 54000, 14),
    lead(
        "l7",
        "Linear",
        "Pied Piper",
        "Proposal",
        "High",
        "Referral",
        98000,
        28,
    ),
    lead("l8", "Slack", "Vehement", "Lost", "Low", "Cold Outreach", 21000, 95),
    lead(
        "l9",
        "Vercel",
        "Massive Dynamic",
        "Won",
        "High",
        "Referral",
        143000,
        110,
    ),
    lead(
        "l10",
        "Airtable",
        "Wayne Ent.",
        "Qualified",
        "High",
        "Event",
        67000,
        18,
    ),
    lead(
        "l11",
        "Datadog",
        "Stark Industries",
        "New",
        "Medium",
        "Website",
        45000,
        2,
    ),
    lead(
        "l12",
        "Snowflake",
        "Cyberdyne",
        "Proposal",
        "High",
        "Referral",
        152000,
        48,
    ),
    lead("l13", "HubSpot", "Tyrell Corp", "Won", "Medium", "Event", 88000, 150),
    lead(
        "l14",
        "Asana",
        "Aperture Labs",
        "Qualified",
        "Low",
        "Social",
        30000,
        22,
    ),
    lead("l15", "Zoom", "Oscorp", "New", "Medium", "Cold Outreach", 26000, 6),
    lead("l16", "GitLab", "LexCorp", "Lost", "Low", "Website", 18000, 70),
];

function lead(_id, name, company, status, priority, source, value, ageDays) {
    return {
        _id,
        name,
        email: `${name.toLowerCase().replace(/[^a-z]/g, "")}@${company
            .toLowerCase()
            .replace(/[^a-z]/g, "")}.com`,
        phone: `+1 555 0${100 + parseInt(_id.slice(1), 10)}`,
        company,
        status,
        priority,
        source,
        value,
        notes:
            status === "Won"
                ? "Closed — Annual Contract Signed."
                : "Active Opportunity In The Pipeline.",
        tags: ["saas"],
        order: 0,
        aiSummary: "",
        aiRiskScore: null,
        createdAt: daysAgo(ageDays),
        updatedAt: daysAgo(Math.max(0, Math.floor(ageDays / 4))),
    };
}

export const makeContacts = () => [
    contact(
        "c1",
        "Olivia Bennett",
        "VP Of Sales",
        "Acme Corp",
        ["decision-maker", "warm"],
        true,
    ),
    contact(
        "c2",
        "Noah Carter",
        "CTO",
        "Globex",
        ["technical", "champion"],
        true,
    ),
    contact(
        "c3",
        "Emma Walsh",
        "Procurement Manager",
        "Initech",
        ["finance"],
        false,
    ),
    contact(
        "c4",
        "Liam Foster",
        "Founder",
        "Umbrella Co",
        ["executive"],
        false,
    ),
    contact(
        "c5",
        "Ava Mitchell",
        "Head Of Operations",
        "Hooli",
        ["warm"],
        false,
    ),
    contact(
        "c6",
        "Ethan Brooks",
        "Product Lead",
        "Pied Piper",
        ["champion", "technical"],
        true,
    ),
    contact(
        "c7",
        "Sophia Reed",
        "Marketing Director",
        "Wayne Ent.",
        ["influencer"],
        false,
    ),
    contact(
        "c8",
        "Mason Hayes",
        "CFO",
        "Cyberdyne",
        ["finance", "executive"],
        false,
    ),
    contact(
        "c9",
        "Isabella Diaz",
        "Head Of Growth",
        "Stark Industries",
        ["vip", "warm"],
        false,
    ),
    contact(
        "c10",
        "Lucas Park",
        "Engineering Manager",
        "Tyrell Corp",
        ["technical"],
        false,
    ),
];

function contact(_id, name, title, company, tags, favorite) {
    return {
        _id,
        name,
        title,
        company,
        email: `${name.split(" ")[0].toLowerCase()}@${company
            .toLowerCase()
            .replace(/[^a-z]/g, "")}.com`,
        phone: `+1 555 0${100 + parseInt(_id.slice(1), 10)}`,
        tags,
        favorite,
        notes: favorite ? "Primary Point Of Contact." : "",
        createdAt: daysAgo(parseInt(_id.slice(1), 10) * 7),
    };
}

const leadLite = (_id, name, company) => ({ _id, name, company });

export const makeNotes = () => [
    note(
        "n1",
        "Decision Expected End Of Month. Loop In A Solutions Engineer For The Technical Review.",
        leadLite("l2", "Google Pay", "Globex"),
        true,
        3,
    ),
    note(
        "n2",
        "Pricing Pushback On The Pro Tier — Prepare An ROI One-Pager Before The Next Call.",
        leadLite("l3", "Amazon Shopping", "Initech"),
        false,
        6,
    ),
    note(
        "n3",
        "Champion Is Leaving The Company; Identify A Backup Stakeholder ASAP.",
        leadLite("l7", "Linear", "Pied Piper"),
        true,
        9,
    ),
    note(
        "n4",
        "Security Questionnaire + SOC 2 Report Requested. Sent To The Trust Center.",
        leadLite("l12", "Snowflake", "Cyberdyne"),
        false,
        12,
    ),
    note(
        "n5",
        "Great Discovery Call — Strong Interest In The Analytics Module.",
        leadLite("l1", "Dribbble Design", "Acme Corp"),
        false,
        1,
    ),
    note(
        "n6",
        "Expansion Likely Next Quarter — Multi-Year Deal Already Signed.",
        leadLite("l9", "Vercel", "Massive Dynamic"),
        false,
        18,
    ),
    note(
        "n7",
        "Scheduling A Technical Deep-Dive With The Engineering Team.",
        leadLite("l10", "Airtable", "Wayne Ent."),
        false,
        5,
    ),
    note(
        "n8",
        "Early Stage, Budget Unconfirmed. Re-Engage In Two Weeks.",
        leadLite("l5", "Notion", "Soylent"),
        false,
        2,
    ),
];

function note(_id, content, lead, pinned, ageDays) {
    return {
        _id,
        content,
        lead,
        contact: null,
        pinned,
        createdAt: daysAgo(ageDays),
    };
}

export const makeTasks = () => [
    task(
        "t1",
        "Send Proposal Follow-Up To Initech",
        "High",
        "Pending",
        daysAgo(2),
        leadLite("l3", "Amazon Shopping", "Initech"),
    ),
    task(
        "t2",
        "Schedule Technical Deep-Dive With Wayne Ent.",
        "Medium",
        "In Progress",
        daysAhead(3),
        leadLite("l10", "Airtable", "Wayne Ent."),
    ),
    task(
        "t3",
        "Quarterly Check-In With Massive Dynamic",
        "Low",
        "Pending",
        daysAhead(7),
        leadLite("l9", "Vercel", "Massive Dynamic"),
    ),
    task(
        "t4",
        "Draft ROI One-Pager For Initech",
        "High",
        "Completed",
        daysAgo(4),
        leadLite("l3", "Amazon Shopping", "Initech"),
    ),
    task(
        "t5",
        "Negotiate Pricing With Cyberdyne",
        "High",
        "Pending",
        today(),
        leadLite("l12", "Snowflake", "Cyberdyne"),
    ),
    task(
        "t6",
        "Share Case Study With Globex",
        "Medium",
        "Pending",
        daysAhead(1),
        leadLite("l2", "Google Pay", "Globex"),
    ),
    task(
        "t7",
        "Confirm Contract Redlines With Pied Piper",
        "High",
        "In Progress",
        daysAgo(1),
        leadLite("l7", "Linear", "Pied Piper"),
    ),
    task(
        "t8",
        "Book Discovery Call With Oscorp",
        "Low",
        "Pending",
        daysAhead(5),
        leadLite("l15", "Zoom", "Oscorp"),
    ),
    task(
        "t9",
        "Send Security Docs To Cyberdyne",
        "Medium",
        "Completed",
        daysAgo(8),
        leadLite("l12", "Snowflake", "Cyberdyne"),
    ),
    task(
        "t10",
        "Re-Engage Stalled Deal At Soylent",
        "Low",
        "Pending",
        daysAhead(14),
        leadLite("l5", "Notion", "Soylent"),
    ),
];

function task(_id, title, priority, status, dueDate, relatedLead) {
    return {
        _id,
        title,
        description: "",
        dueDate,
        status,
        priority,
        relatedLead,
        relatedContact: null,
        completedAt: status === "Completed" ? daysAgo(1) : null,
        createdAt: daysAgo(parseInt(_id.slice(1), 10) * 2),
    };
}

export const mockAiStatus = {
    success: true,
    configured: true,
    model: "openai/gpt-oss-20b",
};

export const mockAiSummary = {
    success: true,
    summary:
        "A Strong Mid-Market Opportunity With An Engaged Champion And Confirmed Budget. The Deal Is Progressing Well But Hinges On A Pending Legal Review.",
    riskScore: 38,
    suggestedPriority: "High",
    nextBestAction:
        "Send The Signed MSA Template To Accelerate The Legal Review And Lock A Close Date.",
};

export const mockAiEmail = {
    success: true,
    subject: "Quick Follow-Up On Next Steps",
    body: "Hi There,\n\nThanks Again For The Great Conversation Earlier This Week. I Wanted To Follow Up With A Quick Summary Of How We Can Help Your Team Hit Its Goals This Quarter.\n\nWould You Be Open To A 20-Minute Call Later This Week To Walk Through The Proposal And Answer Any Questions?\n\nBest,\nAlex Carter\nDealora",
};

export const mockAiInsights = {
    success: true,
    headline:
        "Pipeline Is Healthy, But Proposals Are Stalling At The Redline Stage.",
    insights: [
        "Qualified-To-Proposal Conversion Is Strong At 64%.",
        "Three High-Value Deals Have Sat In Proposal For Over 30 Days.",
        "Referral Leads Close At Nearly 2x The Rate Of Cold Outreach.",
    ],
    recommendations: [
        "Prioritize The Three Stalled Proposals With A Tailored ROI One-Pager.",
        "Double Down On The Referral Channel — It's Your Highest-Converting Source.",
        "Set A 14-Day SLA On The Proposal Stage To Prevent Deals Going Cold.",
    ],
    healthScore: 74,
};
