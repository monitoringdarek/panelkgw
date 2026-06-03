const config = window.KGW_CONFIG;

const appState = {
  supabase: null,
  user: null,
  profile: null,
  circle: null,
  availableCircles: [],
  activeCircleId: null,
  editingCircle: null,
  members: [],
  editingMember: null,
  memberSearchTerm: "",
  contributions: [],
  editingContribution: null,
  contributionSearchTerm: "",
  contributionFilterStatus: "all",
  contributionFilterYear: "all",
  contributionYears: [],
  finances: [],
  editingFinance: null,
  financeSearchTerm: "",
  financeFilterType: "all",
  financeFilterStatus: "all",
  financeFilterYear: "all",
  financeYears: [],
  culinaryEvents: [],
  culinaryDishes: [],
  selectedCulinaryEventId: null,
  selectedCulinaryDishId: null,
  editingCulinaryEvent: null,
  editingCulinaryDish: null,
  culinarySearchTerm: "",
  culinaryDishSearchTerm: "",
  documents: [],
  editingDocument: null,
  documentSearchTerm: "",
  documentFilterType: "all",
  documentFilterYear: "all",
  documentYears: [],
  documentTypes: [],
  documentUploadTargetId: null
};

document.addEventListener("DOMContentLoaded", async () => {
  setupVersionLabels();
  setupSupabase();
  setupEvents();

  await checkExistingSession();
});

function setupVersionLabels() {
  const version = config.APP_VERSION || "";

  setText("loginVersion", version);
  setText("sidebarVersion", version);
  setText("adminVersion", version);
}

function setupSupabase() {
  if (!window.supabase) {
    alert("Nie załadowano biblioteki Supabase.");
    return;
  }

  if (!config.SUPABASE_URL || !config.SUPABASE_KEY || config.SUPABASE_KEY.includes("TU_WKLEJ")) {
    alert("Uzupełnij config.js: SUPABASE_URL i SUPABASE_KEY.");
    return;
  }

  appState.supabase = window.supabase.createClient(
    config.SUPABASE_URL,
    config.SUPABASE_KEY
  );
}

function setupEvents() {
  const loginForm = document.getElementById("loginForm");
  const logoutBtn = document.getElementById("logoutBtn");
  const refreshDashboardBtn = document.getElementById("refreshDashboardBtn");
  const newMemberBtn = document.getElementById("newMemberBtn");
  const refreshMembersBtn = document.getElementById("refreshMembersBtn");
  const memberSearch = document.getElementById("memberSearch");
  const memberForm = document.getElementById("memberForm");
  const cancelMemberBtn = document.getElementById("cancelMemberBtn");
  const cancelMemberSubmitBtn = document.getElementById("cancelMemberSubmitBtn");
  const newContributionBtn = document.getElementById("newContributionBtn");
  const refreshContributionsBtn = document.getElementById("refreshContributionsBtn");
  const contributionSearch = document.getElementById("contributionSearch");
  const generateContributionsBtn = document.getElementById("generateContributionsBtn");
  const contributionStatusFilter = document.getElementById("contributionStatusFilter");
  const contributionYearFilter = document.getElementById("contributionYearFilter");
  const contributionForm = document.getElementById("contributionForm");
  const cancelContributionBtn = document.getElementById("cancelContributionBtn");
  const cancelContributionSubmitBtn = document.getElementById("cancelContributionSubmitBtn");
  const insertTestDataBtn = document.getElementById("insertTestDataBtn");
  const clearTestDataBtn = document.getElementById("clearTestDataBtn");
  const activeCircleSelect = document.getElementById("activeCircleSelect");
  const manageCirclesBtn = document.getElementById("manageCirclesBtn");
  const editActiveCircleBtn = document.getElementById("editActiveCircleBtn");
  const activeCircleForm = document.getElementById("activeCircleForm");
  const cancelActiveCircleEditBtn = document.getElementById("cancelActiveCircleEditBtn");
  const newCircleBtn = document.getElementById("newCircleBtn");
  const circleForm = document.getElementById("circleForm");
  const cancelCircleBtn = document.getElementById("cancelCircleBtn");

  loginForm?.addEventListener("submit", handleLogin);
  logoutBtn?.addEventListener("click", handleLogout);
  refreshDashboardBtn?.addEventListener("click", loadDashboardStats);
  newMemberBtn?.addEventListener("click", () => showMemberForm());
  refreshMembersBtn?.addEventListener("click", loadMembers);
  memberSearch?.addEventListener("input", handleMemberSearch);
  memberForm?.addEventListener("submit", handleMemberFormSubmit);
  cancelMemberBtn?.addEventListener("click", hideMemberForm);
  cancelMemberSubmitBtn?.addEventListener("click", hideMemberForm);
  newContributionBtn?.addEventListener("click", () => showContributionForm());
  refreshContributionsBtn?.addEventListener("click", loadContributions);
  generateContributionsBtn?.addEventListener("click", generateContributionsForPeriod);
  contributionSearch?.addEventListener("input", handleContributionSearch);
  contributionStatusFilter?.addEventListener("change", handleContributionFilterChange);
  contributionYearFilter?.addEventListener("change", handleContributionFilterChange);
  contributionForm?.addEventListener("submit", handleContributionFormSubmit);
  cancelContributionBtn?.addEventListener("click", hideContributionForm);
  cancelContributionSubmitBtn?.addEventListener("click", hideContributionForm);
  insertTestDataBtn?.addEventListener("click", insertTestData);
  clearTestDataBtn?.addEventListener("click", clearTestData);
  activeCircleSelect?.addEventListener("change", handleActiveCircleChange);
  manageCirclesBtn?.addEventListener("click", () => showView("admin"));
  editActiveCircleBtn?.addEventListener("click", showActiveCircleForm);
  activeCircleForm?.addEventListener("submit", handleActiveCircleFormSubmit);
  cancelActiveCircleEditBtn?.addEventListener("click", hideActiveCircleForm);
  newCircleBtn?.addEventListener("click", () => showCircleForm());
  circleForm?.addEventListener("submit", handleCircleFormSubmit);
  cancelCircleBtn?.addEventListener("click", hideCircleForm);

  const newFinanceEntryBtn = document.getElementById("newFinanceEntryBtn");
  const refreshFinanceBtn = document.getElementById("refreshFinanceBtn");
  const financeSearch = document.getElementById("financeSearch");
  const financeTypeFilter = document.getElementById("financeTypeFilter");
  const financeStatusFilter = document.getElementById("financeStatusFilter");
  const financeYearFilter = document.getElementById("financeYearFilter");
  const financeForm = document.getElementById("financeForm");
  const cancelFinanceBtn = document.getElementById("cancelFinanceBtn");
  const cancelFinanceSubmitBtn = document.getElementById("cancelFinanceSubmitBtn");


  const newCulinaryEventBtn = document.getElementById("newCulinaryEventBtn");
  const refreshCulinaryBtn = document.getElementById("refreshCulinaryBtn");
  const culinarySearch = document.getElementById("culinarySearch");
  const culinaryEventForm = document.getElementById("culinaryEventForm");
  const cancelCulinaryEventBtn = document.getElementById("cancelCulinaryEventBtn");
  const cancelCulinaryEventSubmitBtn = document.getElementById("cancelCulinaryEventSubmitBtn");
  const newCulinaryDishBtn = document.getElementById("newCulinaryDishBtn");
  const refreshCulinaryDishesBtn = document.getElementById("refreshCulinaryDishesBtn");
  const culinaryDishSearch = document.getElementById("culinaryDishSearch");
  const culinaryDishForm = document.getElementById("culinaryDishForm");
  const cancelCulinaryDishBtn = document.getElementById("cancelCulinaryDishBtn");
  const cancelCulinaryDishSubmitBtn = document.getElementById("cancelCulinaryDishSubmitBtn");

  const newDocumentBtn = document.getElementById("newDocumentBtn");
  const refreshDocumentsBtn = document.getElementById("refreshDocumentsBtn");
  const documentSearch = document.getElementById("documentSearch");
  const documentTypeFilter = document.getElementById("documentTypeFilter");
  const documentYearFilter = document.getElementById("documentYearFilter");
  const documentForm = document.getElementById("documentForm");
  const cancelDocumentBtn = document.getElementById("cancelDocumentBtn");
  const cancelDocumentSubmitBtn = document.getElementById("cancelDocumentSubmitBtn");
  const showDocumentLinkBtn = document.getElementById("showDocumentLinkBtn");
  const openDocumentLinkBtn = document.getElementById("openDocumentLinkBtn");
  const documentUploadInput = document.getElementById("documentUploadInput");

  newFinanceEntryBtn?.addEventListener("click", () => showFinanceForm());
  refreshFinanceBtn?.addEventListener("click", loadFinances);
  financeSearch?.addEventListener("input", handleFinanceSearch);
  financeTypeFilter?.addEventListener("change", handleFinanceFilterChange);
  financeStatusFilter?.addEventListener("change", handleFinanceFilterChange);
  financeYearFilter?.addEventListener("change", handleFinanceFilterChange);
  financeForm?.addEventListener("submit", handleFinanceFormSubmit);
  cancelFinanceBtn?.addEventListener("click", hideFinanceForm);
  cancelFinanceSubmitBtn?.addEventListener("click", hideFinanceForm);


  newCulinaryEventBtn?.addEventListener("click", () => showCulinaryEventForm());
  refreshCulinaryBtn?.addEventListener("click", loadCulinaryEvents);
  culinarySearch?.addEventListener("input", handleCulinarySearch);
  culinaryEventForm?.addEventListener("submit", handleCulinaryEventFormSubmit);
  cancelCulinaryEventBtn?.addEventListener("click", hideCulinaryEventForm);
  cancelCulinaryEventSubmitBtn?.addEventListener("click", hideCulinaryEventForm);
  newCulinaryDishBtn?.addEventListener("click", () => showCulinaryDishForm());
  refreshCulinaryDishesBtn?.addEventListener("click", () => renderCulinaryDishesList());
  culinaryDishSearch?.addEventListener("input", handleCulinaryDishSearch);
  culinaryDishForm?.addEventListener("submit", handleCulinaryDishFormSubmit);
  cancelCulinaryDishBtn?.addEventListener("click", hideCulinaryDishForm);
  cancelCulinaryDishSubmitBtn?.addEventListener("click", hideCulinaryDishForm);

  newDocumentBtn?.addEventListener("click", () => showDocumentForm());
  refreshDocumentsBtn?.addEventListener("click", loadDocuments);
  documentSearch?.addEventListener("input", handleDocumentSearch);
  documentTypeFilter?.addEventListener("change", handleDocumentFilterChange);
  documentYearFilter?.addEventListener("change", handleDocumentFilterChange);
  documentForm?.addEventListener("submit", handleDocumentFormSubmit);
  cancelDocumentBtn?.addEventListener("click", hideDocumentForm);
  cancelDocumentSubmitBtn?.addEventListener("click", hideDocumentForm);
  showDocumentLinkBtn?.addEventListener("click", () => triggerDocumentFilePicker());
  openDocumentLinkBtn?.addEventListener("click", openCurrentDocumentFile);
  documentUploadInput?.addEventListener("change", handleDocumentFileSelected);

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      showView(btn.dataset.view);
    });
  });

  document.querySelectorAll(".action-grid button").forEach((btn) => {
    btn.addEventListener("click", () => {
      showView(btn.dataset.view);
      if (btn.dataset.action === "new-member") {
        showMemberForm();
      }
      if (btn.dataset.action === "new-contribution") {
        showContributionForm();
      }
      if (btn.dataset.action === "new-finance-income") {
        showFinanceForm("income");
      }
      if (btn.dataset.action === "new-finance-expense") {
        showFinanceForm("expense");
      }
      if (btn.dataset.action === "new-culinary-event") {
        showCulinaryEventForm();
      }
      if (btn.dataset.action === "new-document") {
        showDocumentForm();
      }
    });
  });
}

async function checkExistingSession() {
  if (!appState.supabase) return;

  const { data, error } = await appState.supabase.auth.getSession();

  if (error) {
    console.error(error);
    showLogin();
    return;
  }

  if (data.session?.user) {
    appState.user = data.session.user;
    await loadProfileAndCircle();
    showPanel();
  } else {
    showLogin();
  }
}

async function handleLogin(event) {
  event.preventDefault();

  clearLoginError();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    showLoginError("Wpisz e-mail i hasło.");
    return;
  }

  const { data, error } = await appState.supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error(error);
    showLoginError("Nie udało się zalogować. Sprawdź e-mail i hasło.");
    return;
  }

  appState.user = data.user;

  await loadProfileAndCircle();
  showPanel();
}

async function handleLogout() {
  await appState.supabase.auth.signOut();

  appState.user = null;
  appState.profile = null;
  appState.circle = null;
  appState.availableCircles = [];
  appState.activeCircleId = null;

  showLogin();
}

async function loadProfileAndCircle() {
  const userId = appState.user?.id;

  if (!userId) {
    throw new Error("Brak zalogowanego użytkownika.");
  }

  const { data: profile, error: profileError } = await appState.supabase
    .from("profiles")
    .select("user_id, circle_id, display_name, email, role, is_active")
    .eq("user_id", userId)
    .single();

  if (profileError) {
    console.error(profileError);
    alert("Nie udało się pobrać profilu użytkownika. Sprawdź tabelę profiles i RLS.");
    throw profileError;
  }

  appState.profile = profile;

  await loadAvailableCircles();
  setupActiveCircle();
  renderUserInfo();
  renderSuperAdminUi();
  await loadAllCircleData();
}

function isSuperAdmin() {
  return appState.profile?.role === "super_admin";
}

function getActiveCircleId() {
  if (isSuperAdmin()) {
    return appState.activeCircleId || appState.profile?.circle_id || null;
  }

  return appState.profile?.circle_id || null;
}

function getActiveCircle() {
  const activeId = getActiveCircleId();

  return appState.availableCircles.find((circle) => circle.id === activeId) || appState.circle || null;
}

async function loadAvailableCircles() {
  if (isSuperAdmin()) {
    const { data, error } = await appState.supabase
      .from("circles")
      .select("id, name, short_name, status, membership_fee_amount, contact_email, contact_phone, notes")
      .order("name", { ascending: true });

    if (error) {
      console.error(error);
      alert("Nie udało się pobrać listy kół.");
      appState.availableCircles = [];
      return;
    }

    appState.availableCircles = data || [];
    return;
  }

  if (!appState.profile?.circle_id) {
    appState.availableCircles = [];
    return;
  }

  const { data, error } = await appState.supabase
    .from("circles")
    .select("id, name, short_name, status, membership_fee_amount, contact_email, contact_phone, notes")
    .eq("id", appState.profile.circle_id)
    .single();

  if (error) {
    console.error(error);
    alert("Nie udało się pobrać danych koła.");
    appState.availableCircles = [];
    return;
  }

  appState.availableCircles = data ? [data] : [];
}

function setupActiveCircle() {
  const savedCircleId = localStorage.getItem("panelKGW.activeCircleId");
  const profileCircleId = appState.profile?.circle_id || null;
  const firstCircleId = appState.availableCircles[0]?.id || null;

  let activeId = null;

  if (isSuperAdmin()) {
    const savedExists = savedCircleId && appState.availableCircles.some((circle) => circle.id === savedCircleId);
    const profileExists = profileCircleId && appState.availableCircles.some((circle) => circle.id === profileCircleId);

    activeId = savedExists ? savedCircleId : (profileExists ? profileCircleId : firstCircleId);
  } else {
    activeId = profileCircleId;
  }

  appState.activeCircleId = activeId;
  appState.circle = getActiveCircle();

  if (activeId) {
    localStorage.setItem("panelKGW.activeCircleId", activeId);
  }
}

async function loadAllCircleData() {
  hideMemberForm();
  hideContributionForm();
  hideFinanceForm();
  hideCulinaryEventForm();
  hideCulinaryDishForm();
  hideDocumentForm();
  hideActiveCircleForm();
  hideCircleForm();

  await loadDashboardStats();
  await loadMembers();
  await loadContributions();
  await loadFinances();
  await loadCulinaryEvents();
  await loadDocuments();
  renderCirclesList();
}

function renderUserInfo() {
  const profile = appState.profile;
  const circle = getActiveCircle();
  const email = appState.user?.email || profile?.email || "user@example.com";

  appState.circle = circle;

  setText("circleName", circle?.name || "Panel KGW");
  setText("userRole", "Administrator");
  setText("userEmail", email);
  setText("adminRole", roleLabel(profile?.role));
  setText("adminCircleId", getActiveCircleId() || "Brak aktywnego koła");
}

function renderSuperAdminUi() {
  const superBar = document.getElementById("superAdminBar");
  const section = document.getElementById("superAdminCirclesSection");
  const select = document.getElementById("activeCircleSelect");

  if (!isSuperAdmin()) {
    superBar?.classList.add("hidden");
    section?.classList.add("hidden");
    return;
  }

  superBar?.classList.remove("hidden");
  section?.classList.remove("hidden");

  if (select) {
    select.innerHTML = appState.availableCircles.map((circle) => `
      <option value="${circle.id}" ${circle.id === getActiveCircleId() ? "selected" : ""}>
        ${escapeHtml(circle.name)}
      </option>
    `).join("");
  }

  renderCirclesList();
}

async function handleActiveCircleChange(event) {
  const circleId = event.target.value;
  if (!circleId || circleId === appState.activeCircleId) return;

  appState.activeCircleId = circleId;
  appState.circle = getActiveCircle();
  localStorage.setItem("panelKGW.activeCircleId", circleId);

  renderUserInfo();
  renderSuperAdminUi();
  await loadAllCircleData();
}


function setDefaultContributionGeneratorValues() {
  const genYearEl = document.getElementById("genYear");
  const genMonthEl = document.getElementById("genMonth");
  const genAmountEl = document.getElementById("genAmount");
  const genPeriodEl = document.getElementById("genPeriodLabel");
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  if (genYearEl) genYearEl.value = String(year);
  if (genMonthEl) genMonthEl.value = String(month);
  if (genAmountEl) genAmountEl.value = String(Number(appState.circle?.membership_fee_amount) || 10);
  if (genPeriodEl) genPeriodEl.value = `${monthLabel(month)} ${year}`;
}

async function loadDashboardStats() {
  const circleId = getActiveCircleId();

  if (!circleId) {
    setText("statMembers", "0");
    setText("statContributions", "0");
    setText("statBalance", "0,00 zł");
    setText("statDocuments", "0");
    return;
  }

  await Promise.all([
    loadMembersCount(circleId),
    loadContributionsCount(circleId),
    loadFinanceBalance(circleId),
    loadDocumentsCount(circleId)
  ]);
}

async function loadMembersCount(circleId) {
  const { count, error } = await appState.supabase
    .from("members")
    .select("id", { count: "exact", head: true })
    .eq("circle_id", circleId);

  if (error) {
    console.error(error);
    setText("statMembers", "-");
    return;
  }

  setText("statMembers", String(count || 0));
}

async function loadContributionsCount(circleId) {
  const { count, error } = await appState.supabase
    .from("contributions")
    .select("id", { count: "exact", head: true })
    .eq("circle_id", circleId);

  if (error) {
    console.error(error);
    setText("statContributions", "-");
    return;
  }

  setText("statContributions", String(count || 0));
}

async function loadDocumentsCount(circleId) {
  const { count, error } = await appState.supabase
    .from("documents")
    .select("id", { count: "exact", head: true })
    .eq("circle_id", circleId);

  if (error) {
    console.error(error);
    setText("statDocuments", "-");
    return;
  }

  setText("statDocuments", String(count || 0));
}

async function loadFinanceBalance(circleId) {
  const { data, error } = await appState.supabase
    .from("finance_entries")
    .select("type, amount, status")
    .eq("circle_id", circleId)
    .eq("status", "active");

  if (error) {
    console.error(error);
    setText("statBalance", "-");
    return;
  }

  const balance = (data || []).reduce((sum, entry) => {
    const amount = Number(entry.amount || 0);

    if (entry.type === "income") return sum + amount;
    if (entry.type === "expense") return sum - amount;

    return sum;
  }, 0);

  setText("statBalance", formatMoney(balance));
}

async function refreshFinanceBalance() {
  const circleId = getActiveCircleId();
  if (circleId) {
    await loadFinanceBalance(circleId);
  }
}

async function loadMembers() {
  const circleId = getActiveCircleId();
  const listEl = document.getElementById("membersList");
  const countLabel = document.getElementById("membersCountLabel");

  if (!circleId) {
    if (listEl) {
      listEl.innerHTML = `<div class="module-card"><p class="muted">Brak przypisanego koła. Nie można wyświetlić członków.</p></div>`;
    }
    if (countLabel) setText("membersCountLabel", "0 członków");
    return;
  }

  const { data, error } = await appState.supabase
    .from("members")
    .select("id, first_name, last_name, phone, email, member_status, function_in_circle, notes")
    .eq("circle_id", circleId)
    .order("last_name", { ascending: true })
    .order("first_name", { ascending: true });

  if (error) {
    console.error(error);
    if (listEl) {
      listEl.innerHTML = `<div class="module-card"><p class="muted">Nie udało się pobrać członków. Spróbuj odświeżyć.</p></div>`;
    }
    return;
  }

  appState.members = data || [];
  renderMembersList();
  populateContributionMemberOptions();

  const totalCount = appState.members.length;
  if (countLabel) {
    setText("membersCountLabel", `${totalCount} członków`);
  }
}

async function loadContributions() {
  const circleId = getActiveCircleId();
  const listEl = document.getElementById("contributionsList");
  const countLabel = document.getElementById("contributionsCountLabel");

  if (!circleId) {
    if (listEl) {
      listEl.innerHTML = `<div class="module-card"><p class="muted">Brak przypisanego koła. Nie można wyświetlić składek.</p></div>`;
    }
    if (countLabel) setText("contributionsCountLabel", "0 wpisów");
    return;
  }

  if (!appState.members.length) {
    await loadMembers();
  }

  const { data, error } = await appState.supabase
    .from("contributions")
    .select("id, member_id, contribution_year, contribution_month, period_label, amount, status, payment_method, paid_at, notes")
    .eq("circle_id", circleId)
    .order("contribution_year", { ascending: false })
    .order("contribution_month", { ascending: false });

  if (error) {
    console.error(error);
    if (listEl) {
      listEl.innerHTML = `<div class="module-card"><p class="muted">Nie udało się pobrać składek. Spróbuj odświeżyć.</p></div>`;
    }
    return;
  }

  appState.contributions = data || [];
  updateContributionYears();
  renderContributionSummary();
  renderContributionsList();

  // populate generator defaults
  const genYearEl = document.getElementById("genYear");
  const genMonthEl = document.getElementById("genMonth");
  const genAmountEl = document.getElementById("genAmount");
  const genPeriodEl = document.getElementById("genPeriodLabel");
  const now = new Date();
  if (genYearEl) genYearEl.value = genYearEl.value || String(now.getFullYear());
  if (genMonthEl) genMonthEl.value = genMonthEl.value || String(now.getMonth() + 1);
  const defaultAmount = Number(appState.circle?.membership_fee_amount) || 10.0;
  if (genAmountEl) genAmountEl.value = genAmountEl.value || String(defaultAmount);
  if (genPeriodEl) genPeriodEl.value = genPeriodEl.value || `${monthLabel(Number(genMonthEl?.value || now.getMonth() + 1))} ${genYearEl?.value || now.getFullYear()}`;

  // ustaw domyślny rok na bieżący, jeśli występuje
  const yearEl = document.getElementById("contributionYearFilter");
  const currentYear = String(new Date().getFullYear());
  if (yearEl && appState.contributionYears.includes(currentYear) && appState.contributionFilterYear === "all") {
    yearEl.value = currentYear;
    appState.contributionFilterYear = currentYear;
    renderContributionsList();
  }

  if (countLabel) {
    setText("contributionsCountLabel", `${appState.contributions.length} wpisów`);
  }
}

function updateContributionYears() {
  const years = [...new Set((appState.contributions || []).map((entry) => String(entry.contribution_year).trim()).filter(Boolean))];
  years.sort((a, b) => Number(b) - Number(a));
  appState.contributionYears = years;
  renderContributionYearOptions();
}

function renderContributionYearOptions() {
  const select = document.getElementById("contributionYearFilter");
  if (!select) return;
  select.innerHTML = `<option value="all">Wszystkie lata</option>`;
  appState.contributionYears.forEach((year) => {
    select.innerHTML += `<option value="${year}">${year}</option>`;
  });
}

function populateContributionMemberOptions() {
  const select = document.getElementById("contributionMemberId");
  if (!select) return;
  const currentValue = select.value;
  select.innerHTML = `<option value="">Wybierz członka</option>`;
  appState.members
    .slice()
    .sort((a, b) => {
      const nameA = `${a.last_name} ${a.first_name}`.toLowerCase();
      const nameB = `${b.last_name} ${b.first_name}`.toLowerCase();
      return nameA.localeCompare(nameB);
    })
    .forEach((member) => {
      select.innerHTML += `<option value="${member.id}">${escapeHtml(member.first_name)} ${escapeHtml(member.last_name)}</option>`;
    });
  if (currentValue) select.value = currentValue;
}

function handleContributionSearch(event) {
  appState.contributionSearchTerm = event.target.value.trim().toLowerCase();
  renderContributionsList();
}

function handleContributionFilterChange() {
  const statusFilter = document.getElementById("contributionStatusFilter");
  const yearFilter = document.getElementById("contributionYearFilter");
  appState.contributionFilterStatus = statusFilter?.value || "all";
  appState.contributionFilterYear = yearFilter?.value || "all";
  renderContributionsList();
}

function renderContributionSummary() {
  const paidTotal = (appState.contributions || [])
    .filter((entry) => entry.status === "paid")
    .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const dueEntries = (appState.contributions || []).filter((entry) => entry.status === "due");
  const dueCount = dueEntries.length;
  const dueTotal = dueEntries.reduce((sum, entry) => sum + Number(entry.amount || 0), 0);

  setText("paidContributionsTotal", formatMoney(paidTotal));
  setText("dueContributionsTotal", formatMoney(dueTotal));
  setText("dueContributionsCount", String(dueCount));
  setText("dueContributionsLabel", dueCount === 0 ? "Zaległości pojawią się po dodaniu składek ze statusem Zaległe." : "liczba zaległych");
}

function renderContributionsList() {
  const listEl = document.getElementById("contributionsList");
  if (!listEl) return;

  const searchTerm = appState.contributionSearchTerm;
  const statusFilter = appState.contributionFilterStatus;
  const yearFilter = appState.contributionFilterYear;

  const visibleContributions = (appState.contributions || []).filter((entry) => {
    if (statusFilter !== "all" && entry.status !== statusFilter) {
      return false;
    }
    if (yearFilter !== "all" && String(entry.contribution_year) !== yearFilter) {
      return false;
    }

    const member = appState.members.find((memberItem) => memberItem.id === entry.member_id);
    const memberName = member ? `${member.first_name} ${member.last_name}` : "Nieznany członek";
    const statusLabel = contributionStatusLabel(entry.status);
    const paymentLabel = contributionPaymentMethodLabel(entry.payment_method);

    const text = [
      memberName,
      entry.period_label,
      statusLabel,
      paymentLabel,
      entry.notes
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return !searchTerm || text.includes(searchTerm);
  });

  if (!visibleContributions.length) {
    listEl.innerHTML = `<div class="module-card"><p class="muted">Brak pasujących składek. Spróbuj zmienić wyszukiwanie, filtr lub odświeżyć.</p></div>`;
    return;
  }

  listEl.innerHTML = `
    <div class="table-wrapper">
      <table class="data-table contributions-table">
        <thead>
          <tr>
            <th>Członek</th>
            <th>Okres</th>
            <th class="amount-cell">Kwota</th>
            <th>Status</th>
            <th>Płatność</th>
            <th>Data wpłaty</th>
            <th>Notatka</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          ${visibleContributions
            .map((entry) => {
              const member = appState.members.find((memberItem) => memberItem.id === entry.member_id);
              const memberName = member ? `${escapeHtml(member.first_name)} ${escapeHtml(member.last_name)}` : "Nieznany członek";
              const statusClass = `status-${entry.status}`;
              const statusLabel = contributionStatusLabel(entry.status);
              const paymentLabel = contributionPaymentMethodLabel(entry.payment_method);
              const periodLabel = entry.period_label || `${monthLabel(entry.contribution_month)} ${entry.contribution_year}`;
              const paidAt = entry.paid_at ? formatDate(entry.paid_at) : "-";

              const payButton = entry.status === "due"
                ? `<button type="button" onclick="window.markContributionPaid('${entry.id}')">Oznacz jako zapłacone</button>`
                : "";

              return `
                <tr>
                  <td><strong>${memberName}</strong></td>
                  <td>${escapeHtml(periodLabel)}</td>
                  <td class="amount-cell">${formatMoney(entry.amount)}</td>
                  <td><span class="status-pill ${statusClass}">${statusLabel}</span></td>
                  <td>${escapeHtml(paymentLabel)}</td>
                  <td>${escapeHtml(paidAt)}</td>
                  <td>${escapeHtml(entry.notes || "-")}</td>
                  <td class="table-actions">
                    ${payButton}
                    <button type="button" onclick="window.handleEditContribution('${entry.id}')">Edytuj</button>
                    <button type="button" onclick="window.handleCancelContribution('${entry.id}')" class="secondary">Anuluj wpis</button>
                  </td>
                </tr>`;
            })
            .join("")}
        </tbody>
      </table>
    </div>`;
}

function showContributionForm(contribution = null) {
  appState.editingContribution = contribution?.id || null;
  setText("contributionFormTitle", contribution ? "Edycja składki" : "Nowa składka");
  populateContributionMemberOptions();

  document.getElementById("contributionMemberId").value = contribution?.member_id || "";
  document.getElementById("contributionYear").value = contribution?.contribution_year || new Date().getFullYear();
  document.getElementById("contributionMonth").value = contribution?.contribution_month || "1";
  document.getElementById("contributionPeriodLabel").value = contribution?.period_label || "";
  document.getElementById("contributionAmount").value = contribution?.amount || "";
  document.getElementById("contributionStatus").value = contribution?.status || "paid";
  document.getElementById("contributionPaymentMethod").value = contribution?.payment_method || "cash";
  document.getElementById("contributionPaidAt").value = contribution?.paid_at || "";
  document.getElementById("contributionNotes").value = contribution?.notes || "";

  document.getElementById("contributionFormBox").classList.remove("hidden");
  document.getElementById("contributionMemberId").focus();
}

function hideContributionForm() {
  appState.editingContribution = null;
  document.getElementById("contributionForm").reset();
  document.getElementById("contributionFormBox").classList.add("hidden");
}

async function handleContributionFormSubmit(event) {
  event.preventDefault();

  const circleId = getActiveCircleId();
  if (!circleId) {
    alert("Brak przypisanego koła. Nie można zapisać składki.");
    return;
  }

  const memberId = document.getElementById("contributionMemberId").value;
  const year = Number(document.getElementById("contributionYear").value);
  const month = Number(document.getElementById("contributionMonth").value);
  const periodLabel = document.getElementById("contributionPeriodLabel").value.trim();
  const amount = Number(document.getElementById("contributionAmount").value);
  const status = document.getElementById("contributionStatus").value;
  const paymentMethod = document.getElementById("contributionPaymentMethod").value;
  const paidAt = document.getElementById("contributionPaidAt").value || null;
  const notes = document.getElementById("contributionNotes").value.trim();

  if (!memberId) {
    alert("Wybierz członka do przypisania składki.");
    return;
  }
  if (!year || !month || Number.isNaN(amount)) {
    alert("Podaj poprawny rok, miesiąc i kwotę składki.");
    return;
  }

  const payload = {
    circle_id: circleId,
    member_id: memberId,
    contribution_year: year,
    contribution_month: month,
    period_label: periodLabel || `${monthLabel(month)} ${year}`,
    amount,
    status,
    payment_method: paymentMethod,
    paid_at: paidAt,
    notes
  };

  let contributionId;
  if (appState.editingContribution) {
    const { error } = await appState.supabase
      .from("contributions")
      .update(payload)
      .eq("id", appState.editingContribution);

    if (error) {
      console.error(error);
      alert("Nie udało się zaktualizować składki.");
      return;
    }
    contributionId = appState.editingContribution;

    const previousStatus = appState.contributions.find((item) => item.id === contributionId)?.status;
    if (previousStatus === "paid" && status !== "paid") {
      await cancelFinanceEntry(circleId, contributionId);
    } else if (status === "paid") {
      const member = appState.members.find((m) => m.id === memberId);
      await handleContributionFinanceEntry(circleId, contributionId, member, payload);
    }
  } else {
    const { data, error } = await appState.supabase
      .from("contributions")
      .insert([payload])
      .select();

    if (error) {
      console.error(error);
      alert("Nie udało się dodać składki.");
      return;
    }

    if (data && data.length > 0) {
      contributionId = data[0].id;
      if (status === "paid") {
        const member = appState.members.find((m) => m.id === memberId);
        await handleContributionFinanceEntry(circleId, contributionId, member, payload);
      }
    }
  }

  hideContributionForm();
  await loadContributions();
  await loadDashboardStats();
  await refreshFinanceBalance();
}

async function generateContributionsForPeriod() {
  const circleId = getActiveCircleId();
  if (!circleId) {
    alert("Brak przypisanego koła.");
    return;
  }

  const year = Number(document.getElementById("genYear").value) || new Date().getFullYear();
  const month = Number(document.getElementById("genMonth").value) || (new Date().getMonth() + 1);
  const periodLabel = document.getElementById("genPeriodLabel").value.trim() || `${monthLabel(month)} ${year}`;
  const amountInput = Number(document.getElementById("genAmount").value);

  // default amount from circle or 10.00
  const defaultAmount = Number(appState.circle?.membership_fee_amount || 10.0);
  const amount = Number.isFinite(amountInput) && !Number.isNaN(amountInput) && amountInput > 0 ? amountInput : defaultAmount;

  // ensure members are loaded
  if (!appState.members.length) await loadMembers();

  const activeMembers = (appState.members || []).filter((m) => m.member_status === "active");
  if (!activeMembers.length) {
    alert("Brak aktywnych członków.");
    return;
  }

  // fetch existing contributions for the period to avoid duplicates
  const { data: existing, error: existErr } = await appState.supabase
    .from("contributions")
    .select("member_id")
    .eq("circle_id", circleId)
    .eq("contribution_year", year)
    .eq("contribution_month", month)
    .eq("period_label", periodLabel);

  if (existErr) {
    console.error(existErr);
    alert("Błąd przy sprawdzaniu istniejących składek.");
    return;
  }

  const existingMemberIds = new Set((existing || []).map((r) => r.member_id));

  const toInsert = activeMembers
    .filter((m) => !existingMemberIds.has(m.id))
    .map((m) => ({
      circle_id: circleId,
      member_id: m.id,
      contribution_year: year,
      contribution_month: month,
      period_label: periodLabel,
      amount,
      status: "due",
      payment_method: "cash",
      paid_at: null,
      notes: null
    }));

  let created = 0;
  if (toInsert.length) {
    const { data: insData, error: insErr } = await appState.supabase.from("contributions").insert(toInsert);
    if (insErr) console.error(insErr);
    created = (insData || []).length || 0;
  }

  const skipped = activeMembers.length - created;
  alert(`Utworzono ${created} składek. Pominięto ${skipped} istniejących wpisów.`);

  await loadContributions();
  await loadDashboardStats();
  await refreshFinanceBalance();
}

async function markContributionPaid(contributionId) {
  const entry = appState.contributions.find((c) => c.id === contributionId);
  if (!entry) return;

  const circleId = getActiveCircleId();
  const payment_method = entry.payment_method || "cash";
  const paidAt = new Date().toISOString().split("T")[0];

  const { error } = await appState.supabase
    .from("contributions")
    .update({ status: "paid", paid_at: paidAt, payment_method })
    .eq("id", contributionId);

  if (error) {
    console.error(error);
    alert("Nie udało się oznaczyć składki jako zapłacone.");
    return;
  }

  // ensure member data
  const member = appState.members.find((m) => m.id === entry.member_id);
  await handleContributionFinanceEntry(circleId, contributionId, member, { ...entry, status: "paid", paid_at: paidAt, payment_method });

  await loadContributions();
  await loadDashboardStats();
  await refreshFinanceBalance();
}

window.markContributionPaid = markContributionPaid;

async function handleContributionFinanceEntry(circleId, contributionId, member, contributionData) {
  const entryDate = contributionData.paid_at || new Date().toISOString().split("T")[0];
  const memberName = member ? `${member.first_name} ${member.last_name}` : "Nieznany członek";
  const description = `Składka - ${memberName} - ${contributionData.period_label}`;

  const { data: existingEntry, error: checkError } = await appState.supabase
    .from("finance_entries")
    .select("id, status")
    .eq("circle_id", circleId)
    .eq("source_type", "contribution")
    .eq("source_id", contributionId)
    .eq("status", "active");

  if (checkError) {
    console.error("Błąd przy sprawdzaniu istniejącego wpisu finansowego:", checkError);
    return;
  }

  const financePayload = {
    circle_id: circleId,
    entry_date: entryDate,
    type: "income",
    category: "Składki",
    description,
    amount: contributionData.amount,
    payment_method: contributionData.payment_method,
    status: "active",
    source_type: "contribution",
    source_id: contributionId,
    notes: contributionData.notes || null
  };

  if (existingEntry && existingEntry.length > 0) {
    const { error } = await appState.supabase
      .from("finance_entries")
      .update(financePayload)
      .eq("id", existingEntry[0].id);

    if (error) {
      console.error("Błąd przy aktualizacji wpisu finansowego:", error);
    }
  } else {
    const { error } = await appState.supabase.from("finance_entries").insert([financePayload]);

    if (error) {
      console.error("Błąd przy tworzeniu wpisu finansowego:", error);
    }
  }
}

async function cancelFinanceEntry(circleId, contributionId) {
  const now = new Date().toISOString();

  const { error } = await appState.supabase
    .from("finance_entries")
    .update({
      status: "cancelled",
      cancelled_at: now,
      cancelled_reason: "Składka zmieniona/anulowana"
    })
    .eq("circle_id", circleId)
    .eq("source_type", "contribution")
    .eq("source_id", contributionId)
    .eq("status", "active");

  if (error) {
    console.error("Błąd przy anulowaniu wpisu finansowego:", error);
  }
}

function handleEditContribution(contributionId) {
  const entry = appState.contributions.find((item) => item.id === contributionId);
  if (!entry) return;
  showContributionForm(entry);
}

async function handleCancelContribution(contributionId) {
  const entry = appState.contributions.find((item) => item.id === contributionId);
  if (!entry) return;

  const circleId = getActiveCircleId();

  const { error } = await appState.supabase
    .from("contributions")
    .update({ status: "cancelled" })
    .eq("id", contributionId);

  if (error) {
    console.error(error);
    alert("Nie udało się anulować wpisu składki.");
    return;
  }

  if (entry.status === "paid" && circleId) {
    await cancelFinanceEntry(circleId, contributionId);
  }

  await loadContributions();
  await loadDashboardStats();
  await refreshFinanceBalance();
}

function contributionStatusLabel(status) {
  const labels = {
    paid: "Zapłacone",
    due: "Zaległe",
    exempt: "Zwolnione",
    cancelled: "Anulowane"
  };
  return labels[status] || status;
}

function contributionPaymentMethodLabel(method) {
  const labels = {
    cash: "Gotówka",
    transfer: "Przelew",
    other: "Inne"
  };
  return labels[method] || method;
}

function monthLabel(month) {
  const labels = {
    1: "styczeń",
    2: "luty",
    3: "marzec",
    4: "kwiecień",
    5: "maj",
    6: "czerwiec",
    7: "lipiec",
    8: "sierpień",
    9: "wrzesień",
    10: "październik",
    11: "listopad",
    12: "grudzień"
  };
  return labels[month] || "";
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pl-PL").format(date);
}

function handleMemberSearch(event) {
  appState.memberSearchTerm = event.target.value.trim().toLowerCase();
  renderMembersList();
}

function renderMembersList() {
  const listEl = document.getElementById("membersList");
  if (!listEl) return;

  const searchTerm = appState.memberSearchTerm;
  const visibleMembers = appState.members.filter((member) => {
    const text = [
      member.first_name,
      member.last_name,
      member.phone,
      member.email,
      member.function_in_circle,
      member.notes
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return !searchTerm || text.includes(searchTerm);
  });

  if (!visibleMembers.length) {
    listEl.innerHTML = `<div class="module-card"><p class="muted">Brak pasujących członków. Spróbuj zmienić wyszukiwanie lub odświeżyć.</p></div>`;
    return;
  }

  listEl.innerHTML = `
    <div class="table-wrapper">
      <table class="data-table members-table">
        <thead>
          <tr>
            <th>Członek</th>
            <th>Telefon</th>
            <th>E-mail</th>
            <th>Funkcja</th>
            <th>Status</th>
            <th>Notatka</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          ${visibleMembers
            .map((member) => {
              const statusClass = member.member_status === "inactive" ? "status-inactive" : "status-active";
              const statusLabel = member.member_status === "inactive" ? "Nieaktywna" : "Aktywna";
              const toggleLabel = member.member_status === "inactive" ? "Przywróć aktywną" : "Oznacz nieaktywną";

              return `
                <tr>
                  <td><strong>${escapeHtml(member.first_name)} ${escapeHtml(member.last_name)}</strong></td>
                  <td>${escapeHtml(member.phone || "-")}</td>
                  <td>${escapeHtml(member.email || "-")}</td>
                  <td>${escapeHtml(member.function_in_circle || "-")}</td>
                  <td><span class="status-pill ${statusClass}">${statusLabel}</span></td>
                  <td>${escapeHtml(member.notes || "-")}</td>
                  <td class="table-actions">
                    <button type="button" onclick="window.handleEditMember('${member.id}')">Edytuj</button>
                    <button type="button" onclick="window.handleToggleMemberStatus('${member.id}')" class="secondary">${toggleLabel}</button>
                  </td>
                </tr>`;
            })
            .join("")}
        </tbody>
      </table>
    </div>`;
}

function showMemberForm(member = null) {
  appState.editingMember = member?.id || null;
  setText("memberFormTitle", member ? "Edycja członka" : "Nowy członek");
  document.getElementById("memberFirstName").value = member?.first_name || "";
  document.getElementById("memberLastName").value = member?.last_name || "";
  document.getElementById("memberPhone").value = member?.phone || "";
  document.getElementById("memberEmail").value = member?.email || "";
  document.getElementById("memberStatus").value = member?.member_status || "active";
  document.getElementById("memberFunction").value = member?.function_in_circle || "";
  document.getElementById("memberNotes").value = member?.notes || "";

  document.getElementById("memberFormBox").classList.remove("hidden");
  document.getElementById("memberFirstName").focus();
}

function hideMemberForm() {
  appState.editingMember = null;
  document.getElementById("memberForm").reset();
  document.getElementById("memberFormBox").classList.add("hidden");
}

async function handleMemberFormSubmit(event) {
  event.preventDefault();

  const circleId = getActiveCircleId();
  if (!circleId) {
    alert("Brak przypisanego koła. Nie można zapisać członka.");
    return;
  }

  const firstName = document.getElementById("memberFirstName").value.trim();
  const lastName = document.getElementById("memberLastName").value.trim();
  const phone = document.getElementById("memberPhone").value.trim();
  const email = document.getElementById("memberEmail").value.trim();
  const memberStatus = document.getElementById("memberStatus").value;
  const functionInCircle = document.getElementById("memberFunction").value.trim();
  const notes = document.getElementById("memberNotes").value.trim();

  if (!firstName || !lastName) {
    alert("Podaj imię i nazwisko członka.");
    return;
  }

  const payload = {
    circle_id: circleId,
    first_name: firstName,
    last_name: lastName,
    phone,
    email,
    member_status: memberStatus,
    function_in_circle: functionInCircle,
    notes
  };

  if (appState.editingMember) {
    const { error } = await appState.supabase
      .from("members")
      .update(payload)
      .eq("id", appState.editingMember);

    if (error) {
      console.error(error);
      alert("Nie udało się zaktualizować członka.");
      return;
    }
  } else {
    const { error } = await appState.supabase.from("members").insert([payload]);

    if (error) {
      console.error(error);
      alert("Nie udało się dodać członka.");
      return;
    }
  }

  hideMemberForm();
  await loadMembers();
  await loadDashboardStats();
}

function handleEditMember(memberId) {
  const member = appState.members.find((item) => item.id === memberId);
  if (!member) return;
  showMemberForm(member);
}

async function handleToggleMemberStatus(memberId) {
  const member = appState.members.find((item) => item.id === memberId);
  if (!member) return;

  const newStatus = member.member_status === "inactive" ? "active" : "inactive";
  const { error } = await appState.supabase
    .from("members")
    .update({ member_status: newStatus })
    .eq("id", memberId);

  if (error) {
    console.error(error);
    alert("Nie udało się zmienić statusu członka.");
    return;
  }

  await loadMembers();
  await loadDashboardStats();
}

window.handleEditMember = handleEditMember;
window.handleToggleMemberStatus = handleToggleMemberStatus;
window.handleEditContribution = handleEditContribution;
window.handleCancelContribution = handleCancelContribution;
window.insertTestData = insertTestData;
window.clearTestData = clearTestData;

async function insertTestData() {
  const circleId = getActiveCircleId();
  if (!circleId) {
    alert("Brak przypisanego koła. Nie można dodać danych testowych.");
    return;
  }

  if (!appState.members.length) await loadMembers();

  const sampleMembers = [
    {
      circle_id: circleId,
      first_name: "Anna",
      last_name: "Kowalska",
      phone: "600123456",
      email: "anna.kowalska@test.local",
      member_status: "active",
      function_in_circle: "Skarbnik",
      notes: "TEST_DATA"
    },
    {
      circle_id: circleId,
      first_name: "Jan",
      last_name: "Nowak",
      phone: "600987654",
      email: "jan.nowak@test.local",
      member_status: "active",
      function_in_circle: "Sekretarz",
      notes: "TEST_DATA"
    },
    {
      circle_id: circleId,
      first_name: "Ewa",
      last_name: "Nowicka",
      phone: "600555333",
      email: "ewa.nowicka@test.local",
      member_status: "inactive",
      function_in_circle: "Członek",
      notes: "TEST_DATA"
    }
  ];

  const existingTestEmails = new Set(appState.members.filter((member) => member.notes === "TEST_DATA").map((member) => member.email));
  const membersToInsert = sampleMembers.filter((member) => !existingTestEmails.has(member.email));

  if (membersToInsert.length) {
    const { error } = await appState.supabase.from("members").insert(membersToInsert);
    if (error) {
      console.error(error);
      alert("Nie udało się dodać danych testowych członków.");
      return;
    }
  }

  await loadMembers();

  const testMembersByEmail = Object.fromEntries(
    appState.members
      .filter((member) => member.notes === "TEST_DATA")
      .map((member) => [member.email, member])
  );

  const today = new Date().toISOString().split("T")[0];
  const sampleContributions = [
    {
      memberEmail: "anna.kowalska@test.local",
      contribution_year: new Date().getFullYear(),
      contribution_month: new Date().getMonth() + 1,
      period_label: "Aktualny miesiąc",
      amount: 25,
      status: "due",
      payment_method: "cash",
      paid_at: null,
      notes: "TEST_DATA"
    },
    {
      memberEmail: "jan.nowak@test.local",
      contribution_year: new Date().getFullYear(),
      contribution_month: new Date().getMonth() + 1,
      period_label: "Aktualny miesiąc",
      amount: 30,
      status: "paid",
      payment_method: "transfer",
      paid_at: today,
      notes: "TEST_DATA"
    }
  ];

  const conQuery = await appState.supabase
    .from("contributions")
    .select("member_id, contribution_year, contribution_month, period_label")
    .eq("circle_id", circleId)
    .eq("notes", "TEST_DATA");

  if (conQuery.error) {
    console.error(conQuery.error);
    alert("Nie udało się sprawdzić istniejących danych testowych składek.");
    return;
  }

  const existingContributions = new Set(
    (conQuery.data || []).map((entry) => `${entry.member_id}_${entry.contribution_year}_${entry.contribution_month}_${entry.period_label}`)
  );

  const contributionsToInsert = sampleContributions
    .map((item) => {
      const member = testMembersByEmail[item.memberEmail];
      if (!member) return null;
      return {
        circle_id: circleId,
        member_id: member.id,
        contribution_year: item.contribution_year,
        contribution_month: item.contribution_month,
        period_label: item.period_label,
        amount: item.amount,
        status: item.status,
        payment_method: item.payment_method,
        paid_at: item.paid_at,
        notes: item.notes
      };
    })
    .filter(Boolean)
    .filter((entry) => !existingContributions.has(`${entry.member_id}_${entry.contribution_year}_${entry.contribution_month}_${entry.period_label}`));

  if (contributionsToInsert.length) {
    const { data, error } = await appState.supabase
      .from("contributions")
      .insert(contributionsToInsert)
      .select();

    if (error) {
      console.error(error);
      alert("Nie udało się dodać danych testowych składek.");
      return;
    }

    const paidEntries = (data || []).filter((entry) => entry.status === "paid");
    for (const entry of paidEntries) {
      const member = appState.members.find((m) => m.id === entry.member_id);
      await handleContributionFinanceEntry(circleId, entry.id, member, entry);
    }
  }

  await loadContributions();
  await loadDashboardStats();
  await refreshFinanceBalance();
  alert("Dane testowe zostały dodane lub już istnieją.");
}

async function clearTestData() {
  const circleId = getActiveCircleId();
  if (!circleId) {
    alert("Brak przypisanego koła. Nie można usunąć danych testowych.");
    return;
  }

  const { data: contributions, error: contributionsError } = await appState.supabase
    .from("contributions")
    .select("id, status")
    .eq("circle_id", circleId)
    .eq("notes", "TEST_DATA");

  if (contributionsError) {
    console.error(contributionsError);
    alert("Nie udało się pobrać danych testowych składek.");
    return;
  }

  const paidContributionIds = (contributions || [])
    .filter((entry) => entry.status === "paid")
    .map((entry) => entry.id);

  if (paidContributionIds.length) {
    const { error } = await appState.supabase
      .from("finance_entries")
      .update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
        cancelled_reason: "Usunięcie danych testowych"
      })
      .eq("circle_id", circleId)
      .eq("source_type", "contribution")
      .in("source_id", paidContributionIds)
      .eq("status", "active");

    if (error) {
      console.error(error);
    }
  }

  const { error: deleteContributionsError } = await appState.supabase
    .from("contributions")
    .delete()
    .eq("circle_id", circleId)
    .eq("notes", "TEST_DATA");

  if (deleteContributionsError) {
    console.error(deleteContributionsError);
    alert("Nie udało się usunąć danych testowych składek.");
    return;
  }

  const { error: deleteMembersError } = await appState.supabase
    .from("members")
    .delete()
    .eq("circle_id", circleId)
    .eq("notes", "TEST_DATA");

  if (deleteMembersError) {
    console.error(deleteMembersError);
    alert("Nie udało się usunąć danych testowych członków.");
    return;
  }

  await loadMembers();
  await loadContributions();
  await loadDashboardStats();
  await refreshFinanceBalance();
  alert("Dane testowe zostały usunięte.");
}

async function loadFinances() {
  const circleId = getActiveCircleId();
  const listEl = document.getElementById("financesList");
  const countLabel = document.getElementById("financeCountLabel");

  if (!circleId) {
    if (listEl) {
      listEl.innerHTML = `<div class="module-card"><p class="muted">Brak przypisanego koła. Nie można wyświetlić finansów.</p></div>`;
    }
    if (countLabel) setText("financeCountLabel", "0 wpisów");
    return;
  }

  const { data, error } = await appState.supabase
    .from("finance_entries")
    .select("*")
    .eq("circle_id", circleId)
    .order("entry_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    if (listEl) {
      listEl.innerHTML = `<div class="module-card"><p class="muted">Nie udało się pobrać wpisów finansowych. Spróbuj odświeżyć.</p></div>`;
    }
    return;
  }

  appState.finances = data || [];
  updateFinanceYears();
  renderFinanceSummary();
  renderFinanceList();

  const totalCount = appState.finances.length;
  if (countLabel) {
    setText("financeCountLabel", `${totalCount} wpisów`);
  }
}

function updateFinanceYears() {
  const years = [...new Set((appState.finances || []).map((entry) => String(entry.entry_date).substring(0, 4)).filter(Boolean))];
  years.sort((a, b) => Number(b) - Number(a));
  appState.financeYears = years;
  renderFinanceYearOptions();
}

function renderFinanceYearOptions() {
  const select = document.getElementById("financeYearFilter");
  if (!select) return;
  select.innerHTML = `<option value="all">Wszystkie lata</option>`;
  appState.financeYears.forEach((year) => {
    select.innerHTML += `<option value="${year}">${year}</option>`;
  });
}

function renderFinanceSummary() {
  const activeEntries = (appState.finances || []).filter((entry) => entry.status === "active");
  const income = activeEntries
    .filter((entry) => entry.type === "income")
    .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const expenses = activeEntries
    .filter((entry) => entry.type === "expense")
    .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const balance = income - expenses;
  const cancelled = (appState.finances || []).filter((entry) => entry.status === "cancelled").length;

  setText("financeBalance", formatMoney(balance));
  setText("financeIncome", formatMoney(income));
  setText("financeExpenses", formatMoney(expenses));
  setText("financeCancelled", String(cancelled));
}

function handleFinanceSearch(event) {
  appState.financeSearchTerm = event.target.value.trim().toLowerCase();
  renderFinanceList();
}

function handleFinanceFilterChange() {
  const typeFilter = document.getElementById("financeTypeFilter");
  const statusFilter = document.getElementById("financeStatusFilter");
  const yearFilter = document.getElementById("financeYearFilter");
  appState.financeFilterType = typeFilter?.value || "all";
  appState.financeFilterStatus = statusFilter?.value || "all";
  appState.financeFilterYear = yearFilter?.value || "all";
  renderFinanceList();
}

function renderFinanceList() {
  const listEl = document.getElementById("financesList");
  if (!listEl) return;

  const searchTerm = appState.financeSearchTerm;
  const typeFilter = appState.financeFilterType;
  const statusFilter = appState.financeFilterStatus;
  const yearFilter = appState.financeFilterYear;

  const visibleFinances = (appState.finances || []).filter((entry) => {
    if (typeFilter !== "all" && entry.type !== typeFilter) return false;
    if (statusFilter !== "all" && entry.status !== statusFilter) return false;
    if (yearFilter !== "all" && entry.entry_date.substring(0, 4) !== yearFilter) return false;

    const typeLabel = entry.type === "income" ? "Wpływ" : "Wydatek";
    const statusLabel = entry.status === "active" ? "Aktywny" : "Anulowany";
    const paymentLabel = financePaymentMethodLabel(entry.payment_method);
    const sourceLabel = financeSourceLabel(entry.source_type);

    const text = [
      entry.entry_date,
      typeLabel,
      entry.category,
      entry.description,
      paymentLabel,
      statusLabel,
      sourceLabel,
      entry.notes
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return !searchTerm || text.includes(searchTerm);
  });

  if (!visibleFinances.length) {
    listEl.innerHTML = `<div class="module-card"><p class="muted">Brak pasujących wpisów. Spróbuj zmienić wyszukiwanie, filtr lub odświeżyć.</p></div>`;
    return;
  }

  listEl.innerHTML = `
    <div class="table-wrapper">
      <table class="data-table finances-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Typ</th>
            <th>Kategoria</th>
            <th>Opis</th>
            <th>Metoda</th>
            <th class="amount-cell">Kwota</th>
            <th>Status</th>
            <th>Źródło</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          ${visibleFinances
            .map((entry) => {
              const typeLabel = entry.type === "income" ? "Wpływ" : "Wydatek";
              const typeClass = entry.type === "income" ? "type-income" : "type-expense";
              const statusLabel = entry.status === "active" ? "Aktywny" : "Anulowany";
              const statusClass = `status-${entry.status}`;
              const paymentLabel = financePaymentMethodLabel(entry.payment_method);
              const sourceLabel = financeSourceLabel(entry.source_type);
              const amountDisplay = entry.type === "income" ? formatMoney(entry.amount) : `−${formatMoney(entry.amount)}`;
              const isManualEntry = !entry.source_type || entry.source_type.trim() === "";
              const canEdit = isManualEntry;
              const canCancel = entry.status === "active" && isManualEntry;

              let editButton = "";
              if (canEdit) {
                editButton = `<button type="button" onclick="window.handleEditFinanceEntry('${entry.id}')">Edytuj</button>`;
              } else {
                editButton = `<span class="managed-by-contributions">Zarządzane przez Składki</span>`;
              }

              let cancelButton = "";
              if (canCancel) {
                cancelButton = `<button type="button" onclick="window.handleCancelFinanceEntryFull('${entry.id}')" class="secondary">Anuluj</button>`;
              }

              return `
                <tr>
                  <td>${escapeHtml(entry.entry_date)}</td>
                  <td><span class="type-pill ${typeClass}">${typeLabel}</span></td>
                  <td>${escapeHtml(entry.category || "-")}</td>
                  <td>${escapeHtml(entry.description || "-")}</td>
                  <td>${escapeHtml(paymentLabel)}</td>
                  <td class="amount-cell">${amountDisplay}</td>
                  <td><span class="status-pill ${statusClass}">${statusLabel}</span></td>
                  <td>${escapeHtml(sourceLabel)}</td>
                  <td class="table-actions">
                    ${editButton}
                    ${cancelButton}
                  </td>
                </tr>`;
            })
            .join("")}
        </tbody>
      </table>
    </div>`;
}

function showFinanceForm(presetType = null) {
  appState.editingFinance = null;
  setText("financeFormTitle", "Nowy wpis finansowy");
  const today = new Date().toISOString().split("T")[0];

  document.getElementById("financeEntryDate").value = today;
  document.getElementById("financeType").value = presetType || "income";
  document.getElementById("financeCategory").value = "";
  document.getElementById("financeDescription").value = "";
  document.getElementById("financeAmount").value = "";
  document.getElementById("financePaymentMethod").value = "cash";
  document.getElementById("financeStatus").value = "active";
  document.getElementById("financeNotes").value = "";

  document.getElementById("financeFormBox").classList.remove("hidden");
  document.getElementById("financeDescription").focus();
}

function hideFinanceForm() {
  appState.editingFinance = null;
  document.getElementById("financeForm").reset();
  document.getElementById("financeFormBox").classList.add("hidden");
}

async function handleFinanceFormSubmit(event) {
  event.preventDefault();

  const circleId = getActiveCircleId();
  if (!circleId) {
    alert("Brak przypisanego koła. Nie można zapisać wpisu finansowego.");
    return;
  }

  const entryDate = document.getElementById("financeEntryDate").value;
  const type = document.getElementById("financeType").value;
  const category = document.getElementById("financeCategory").value.trim();
  const description = document.getElementById("financeDescription").value.trim();
  const amount = Number(document.getElementById("financeAmount").value);
  const paymentMethod = document.getElementById("financePaymentMethod").value;
  const status = document.getElementById("financeStatus").value;
  const notes = document.getElementById("financeNotes").value.trim();

  if (!entryDate || !category || !description || !amount || amount <= 0) {
    alert("Uzupełnij wszystkie wymagane pola.");
    return;
  }

  const payload = {
    circle_id: circleId,
    entry_date: entryDate,
    type,
    category,
    description,
    amount,
    payment_method: paymentMethod,
    status,
    notes: notes || null,
    source_type: null,
    source_id: null
  };

  if (appState.editingFinance) {
    const { error } = await appState.supabase
      .from("finance_entries")
      .update(payload)
      .eq("id", appState.editingFinance);

    if (error) {
      console.error(error);
      alert("Nie udało się zaktualizować wpisu finansowego.");
      return;
    }
  } else {
    const { error } = await appState.supabase.from("finance_entries").insert([payload]);

    if (error) {
      console.error(error);
      alert("Nie udało się dodać wpisu finansowego.");
      return;
    }
  }

  hideFinanceForm();
  await loadFinances();
  await loadDashboardStats();
  await refreshFinanceBalance();
}

function handleEditFinanceEntry(entryId) {
  const entry = appState.finances.find((item) => item.id === entryId);
  if (!entry) return;
  showFinanceForm();
  appState.editingFinance = entryId;
  setText("financeFormTitle", "Edycja wpisu finansowego");
  document.getElementById("financeEntryDate").value = entry.entry_date;
  document.getElementById("financeType").value = entry.type;
  document.getElementById("financeCategory").value = entry.category;
  document.getElementById("financeDescription").value = entry.description;
  document.getElementById("financeAmount").value = entry.amount;
  document.getElementById("financePaymentMethod").value = entry.payment_method;
  document.getElementById("financeStatus").value = entry.status;
  document.getElementById("financeNotes").value = entry.notes || "";
  document.getElementById("financeFormBox").classList.remove("hidden");
  document.getElementById("financeDescription").focus();
}

async function handleCancelFinanceEntryFull(entryId) {
  const entry = appState.finances.find((item) => item.id === entryId);
  if (!entry) return;

  const circleId = getActiveCircleId();

  const { error } = await appState.supabase
    .from("finance_entries")
    .update({
      status: "cancelled",
      cancelled_at: new Date().toISOString(),
      cancelled_reason: "Anulowano ręcznie w Finansach"
    })
    .eq("id", entryId);

  if (error) {
    console.error(error);
    alert("Nie udało się anulować wpisu finansowego.");
    return;
  }

  await loadFinances();
  await loadDashboardStats();
  await refreshFinanceBalance();
}

window.handleEditFinanceEntry = handleEditFinanceEntry;
window.handleCancelFinanceEntryFull = handleCancelFinanceEntryFull;

function financePaymentMethodLabel(method) {
  const labels = {
    cash: "Gotówka",
    transfer: "Przelew",
    card: "Karta",
    other: "Inne"
  };
  return labels[method] || method;
}

function financeSourceLabel(sourceType) {
  if (!sourceType || sourceType.trim() === "") return "Ręczny wpis";
  if (sourceType === "contribution") return "Składka";
  return sourceType;
}



// =========================================================
// KULINARNE WSPOMNIENIA
// =========================================================

async function loadCulinaryEvents() {
  const circleId = getActiveCircleId();
  const listEl = document.getElementById("culinaryEventsList");
  const countLabel = document.getElementById("culinaryCountLabel");

  if (!circleId) {
    if (listEl) {
      listEl.innerHTML = `<div class="module-card"><p class="muted">Brak przypisanego koła. Nie można wyświetlić kulinarnych wspomnień.</p></div>`;
    }
    if (countLabel) setText("culinaryCountLabel", "0 wydarzeń");
    return;
  }

  const { data: events, error: eventsError } = await appState.supabase
    .from("culinary_events")
    .select("*")
    .eq("circle_id", circleId)
    .order("event_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (eventsError) {
    console.error(eventsError);
    if (listEl) {
      listEl.innerHTML = `<div class="module-card"><p class="muted">Nie udało się pobrać wydarzeń kulinarnych.</p></div>`;
    }
    return;
  }

  const { data: dishes, error: dishesError } = await appState.supabase
    .from("culinary_dishes")
    .select("*")
    .eq("circle_id", circleId)
    .order("name", { ascending: true });

  if (dishesError) {
    console.error(dishesError);
    alert("Nie udało się pobrać potraw.");
    return;
  }

  appState.culinaryEvents = events || [];
  appState.culinaryDishes = dishes || [];

  if (appState.selectedCulinaryEventId) {
    const selectedExists = appState.culinaryEvents.some((event) => event.id === appState.selectedCulinaryEventId);
    if (!selectedExists) {
      appState.selectedCulinaryEventId = null;
    }
  }

  renderCulinarySummary();
  renderCulinaryEventsList();
  renderSelectedCulinaryEvent();

  if (countLabel) {
    setText("culinaryCountLabel", `${appState.culinaryEvents.length} wydarzeń`);
  }
}

function renderCulinarySummary() {
  setText("culinaryEventsTotal", String((appState.culinaryEvents || []).length));
  setText("culinaryDishesTotal", String((appState.culinaryDishes || []).length));
}

function handleCulinarySearch(event) {
  appState.culinarySearchTerm = event.target.value.trim().toLowerCase();
  renderCulinaryEventsList();
}

function handleCulinaryDishSearch(event) {
  appState.culinaryDishSearchTerm = event.target.value.trim().toLowerCase();
  renderCulinaryDishesList();
}

function getDishesForEvent(eventId) {
  return (appState.culinaryDishes || []).filter((dish) => dish.event_id === eventId);
}

function renderCulinaryEventsList() {
  const listEl = document.getElementById("culinaryEventsList");
  if (!listEl) return;

  const searchTerm = appState.culinarySearchTerm || "";

  const visibleEvents = (appState.culinaryEvents || []).filter((event) => {
    const text = [
      event.event_date,
      event.title,
      event.place,
      event.description,
      event.notes
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return !searchTerm || text.includes(searchTerm);
  });

  if (!visibleEvents.length) {
    listEl.innerHTML = `<div class="module-card"><p class="muted">Brak pasujących wydarzeń. Dodaj pierwsze kulinarne wspomnienie albo zmień wyszukiwanie.</p></div>`;
    return;
  }

  listEl.innerHTML = `
    <div class="table-wrapper">
      <table class="data-table culinary-events-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Wydarzenie</th>
            <th>Miejsce</th>
            <th>Potrawy</th>
            <th>Opis</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          ${visibleEvents.map((event) => {
            const dishesCount = getDishesForEvent(event.id).length;
            const selectedClass = event.id === appState.selectedCulinaryEventId ? "selected-row" : "";

            return `
              <tr class="${selectedClass}">
                <td>${escapeHtml(formatDate(event.event_date))}</td>
                <td>
                  <span class="member-name">${escapeHtml(event.title || "Bez tytułu")}</span>
                  ${event.notes ? `<span class="table-note">${escapeHtml(event.notes)}</span>` : ""}
                </td>
                <td>${escapeHtml(event.place || "-")}</td>
                <td><strong>${dishesCount}</strong></td>
                <td>${escapeHtml(event.description || "-")}</td>
                <td class="table-actions">
                  <span class="actions-wrap">
                    <button type="button" onclick="window.handleSelectCulinaryEvent('${event.id}')">Potrawy</button>
                    <button type="button" onclick="window.handleEditCulinaryEvent('${event.id}')">Edytuj</button>
                    <button type="button" onclick="window.handlePrintCulinaryEvent('${event.id}')" class="secondary">Drukuj</button>
                    <button type="button" onclick="window.handleDeleteCulinaryEvent('${event.id}')" class="secondary">Usuń</button>
                  </span>
                </td>
              </tr>`;
          }).join("")}
        </tbody>
      </table>
    </div>`;
}

function renderSelectedCulinaryEvent() {
  const panel = document.getElementById("culinaryDishesPanel");
  const titleEl = document.getElementById("culinarySelectedEventTitle");
  const infoEl = document.getElementById("culinarySelectedEventInfo");

  if (!panel) return;

  const selectedEvent = appState.culinaryEvents.find((event) => event.id === appState.selectedCulinaryEventId);

  if (!selectedEvent) {
    panel.classList.add("hidden");
    hideCulinaryDishForm();
    return;
  }

  panel.classList.remove("hidden");
  setText("culinarySelectedEventTitle", selectedEvent.title || "Wybrane wydarzenie");

  const info = [
    formatDate(selectedEvent.event_date),
    selectedEvent.place
  ].filter((item) => item && item !== "-").join(" • ");

  setText("culinarySelectedEventInfo", info || "Dodaj potrawy przygotowane na to wydarzenie.");
  renderCulinaryDishesList();
}

function renderCulinaryDishesList() {
  const listEl = document.getElementById("culinaryDishesList");
  const countLabel = document.getElementById("culinaryDishesCountLabel");
  if (!listEl) return;

  const selectedEventId = appState.selectedCulinaryEventId;
  if (!selectedEventId) {
    listEl.innerHTML = `<div class="module-card"><p class="muted">Wybierz wydarzenie z tabeli powyżej.</p></div>`;
    if (countLabel) setText("culinaryDishesCountLabel", "0 potraw");
    return;
  }

  const searchTerm = appState.culinaryDishSearchTerm || "";
  const dishes = getDishesForEvent(selectedEventId).filter((dish) => {
    const text = [
      dish.name,
      dish.prepared_by,
      dish.ingredients,
      dish.description,
      dish.notes
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return !searchTerm || text.includes(searchTerm);
  });

  if (countLabel) {
    setText("culinaryDishesCountLabel", `${dishes.length} potraw`);
  }

  if (!dishes.length) {
    appState.selectedCulinaryDishId = null;
    listEl.innerHTML = `<div class="module-card"><p class="muted">Brak potraw dla tego wydarzenia. Kliknij „Nowa potrawa”.</p></div>`;
    return;
  }

  const selectedDish = dishes.find((dish) => dish.id === appState.selectedCulinaryDishId) || null;
  if (appState.selectedCulinaryDishId && !selectedDish) {
    appState.selectedCulinaryDishId = null;
  }

  listEl.innerHTML = `
    <div class="table-wrapper">
      <table class="data-table culinary-dishes-table">
        <thead>
          <tr>
            <th>Potrawa</th>
            <th>Przygotowała</th>
            <th>Składniki</th>
            <th>Opis</th>
            <th>Uwagi</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          ${dishes.map((dish) => {
            const selectedClass = dish.id === appState.selectedCulinaryDishId ? "selected-row" : "";
            return `
              <tr class="${selectedClass}">
                <td><span class="member-name">${escapeHtml(dish.name || "Bez nazwy")}</span></td>
                <td>${escapeHtml(dish.prepared_by || "-")}</td>
                <td><span class="table-clamp clamp-2">${escapeHtml(dish.ingredients || "-")}</span></td>
                <td><span class="table-clamp clamp-3">${escapeHtml(dish.description || "-")}</span></td>
                <td><span class="table-clamp clamp-1">${escapeHtml(dish.notes || "-")}</span></td>
                <td class="table-actions">
                  <span class="actions-wrap">
                    <button type="button" onclick="window.handleShowCulinaryDishDetails('${dish.id}')">Szczegóły</button>
                    <button type="button" onclick="window.handleEditCulinaryDish('${dish.id}')">Edytuj</button>
                    <button type="button" onclick="window.handleDeleteCulinaryDish('${dish.id}')" class="secondary">Usuń</button>
                  </span>
                </td>
              </tr>`;
          }).join("")}
        </tbody>
      </table>
    </div>
    ${selectedDish ? renderCulinaryDishDetails(selectedDish) : ""}`;
}

function renderCulinaryDishDetails(dish) {
  return `
    <section class="culinary-detail-panel">
      <div class="culinary-detail-header">
        <div>
          <p class="eyebrow">Szczegóły potrawy</p>
          <h3>${escapeHtml(dish.name || "Bez nazwy")}</h3>
          <p class="muted">${dish.prepared_by ? `Przygotowała: ${escapeHtml(dish.prepared_by)}` : "Brak informacji o osobie przygotowującej."}</p>
        </div>
        <button type="button" class="secondary-btn" onclick="window.handleCloseCulinaryDishDetails()">Zamknij</button>
      </div>

      <div class="culinary-detail-grid">
        <div class="detail-block">
          <strong>Składniki</strong>
          <p>${escapeHtml(dish.ingredients || "Brak składników.")}</p>
        </div>

        <div class="detail-block">
          <strong>Opis / przepis</strong>
          <p>${escapeHtml(dish.description || "Brak opisu.")}</p>
        </div>

        <div class="detail-block detail-block-full">
          <strong>Uwagi</strong>
          <p>${escapeHtml(dish.notes || "Brak uwag.")}</p>
        </div>
      </div>
    </section>`;
}

function showCulinaryEventForm(eventEntry = null) {
  appState.editingCulinaryEvent = eventEntry?.id || null;
  setText("culinaryEventFormTitle", eventEntry ? "Edycja wydarzenia" : "Nowe wydarzenie");

  document.getElementById("culinaryEventDate").value = eventEntry?.event_date || new Date().toISOString().split("T")[0];
  document.getElementById("culinaryEventTitle").value = eventEntry?.title || "";
  document.getElementById("culinaryEventPlace").value = eventEntry?.place || "";
  document.getElementById("culinaryEventDescription").value = eventEntry?.description || "";
  document.getElementById("culinaryEventNotes").value = eventEntry?.notes || "";

  document.getElementById("culinaryEventFormBox").classList.remove("hidden");
  document.getElementById("culinaryEventTitle").focus();
}

function hideCulinaryEventForm() {
  appState.editingCulinaryEvent = null;
  document.getElementById("culinaryEventForm")?.reset();
  document.getElementById("culinaryEventFormBox")?.classList.add("hidden");
}

async function handleCulinaryEventFormSubmit(event) {
  event.preventDefault();

  const circleId = getActiveCircleId();
  if (!circleId) {
    alert("Brak przypisanego koła. Nie można zapisać wydarzenia.");
    return;
  }

  const title = document.getElementById("culinaryEventTitle").value.trim();
  if (!title) {
    alert("Podaj nazwę wydarzenia.");
    return;
  }

  const payload = {
    circle_id: circleId,
    event_date: document.getElementById("culinaryEventDate").value || null,
    title,
    place: document.getElementById("culinaryEventPlace").value.trim() || null,
    description: document.getElementById("culinaryEventDescription").value.trim() || null,
    notes: document.getElementById("culinaryEventNotes").value.trim() || null
  };

  let savedId = appState.editingCulinaryEvent;

  if (appState.editingCulinaryEvent) {
    const { error } = await appState.supabase
      .from("culinary_events")
      .update(payload)
      .eq("id", appState.editingCulinaryEvent);

    if (error) {
      console.error(error);
      alert("Nie udało się zaktualizować wydarzenia.");
      return;
    }
  } else {
    const { data, error } = await appState.supabase
      .from("culinary_events")
      .insert([payload])
      .select("id")
      .single();

    if (error) {
      console.error(error);
      alert("Nie udało się dodać wydarzenia.");
      return;
    }

    savedId = data?.id || null;
  }

  hideCulinaryEventForm();
  appState.selectedCulinaryEventId = savedId || appState.selectedCulinaryEventId;
  await loadCulinaryEvents();
}

function handleSelectCulinaryEvent(eventId) {
  appState.selectedCulinaryEventId = eventId;
  appState.selectedCulinaryDishId = null;
  hideCulinaryDishForm();
  renderCulinaryEventsList();
  renderSelectedCulinaryEvent();
}

function handleEditCulinaryEvent(eventId) {
  const eventEntry = appState.culinaryEvents.find((item) => item.id === eventId);
  if (!eventEntry) return;
  showCulinaryEventForm(eventEntry);
}

async function handleDeleteCulinaryEvent(eventId) {
  const eventEntry = appState.culinaryEvents.find((item) => item.id === eventId);
  if (!eventEntry) return;

  const confirmed = confirm(`Usunąć wydarzenie wraz z potrawami: ${eventEntry.title}?`);
  if (!confirmed) return;

  const { error } = await appState.supabase
    .from("culinary_events")
    .delete()
    .eq("id", eventId);

  if (error) {
    console.error(error);
    alert("Nie udało się usunąć wydarzenia.");
    return;
  }

  if (appState.selectedCulinaryEventId === eventId) {
    appState.selectedCulinaryEventId = null;
  }

  await loadCulinaryEvents();
}

function showCulinaryDishForm(dishEntry = null) {
  if (!appState.selectedCulinaryEventId) {
    alert("Najpierw wybierz wydarzenie.");
    return;
  }

  appState.editingCulinaryDish = dishEntry?.id || null;
  setText("culinaryDishFormTitle", dishEntry ? "Edycja potrawy" : "Nowa potrawa");

  document.getElementById("culinaryDishName").value = dishEntry?.name || "";
  document.getElementById("culinaryDishPreparedBy").value = dishEntry?.prepared_by || "";
  document.getElementById("culinaryDishIngredients").value = dishEntry?.ingredients || "";
  document.getElementById("culinaryDishDescription").value = dishEntry?.description || "";
  document.getElementById("culinaryDishNotes").value = dishEntry?.notes || "";

  document.getElementById("culinaryDishFormBox").classList.remove("hidden");
  document.getElementById("culinaryDishName").focus();
}

function hideCulinaryDishForm() {
  appState.editingCulinaryDish = null;
  document.getElementById("culinaryDishForm")?.reset();
  document.getElementById("culinaryDishFormBox")?.classList.add("hidden");
}

async function handleCulinaryDishFormSubmit(event) {
  event.preventDefault();

  const circleId = getActiveCircleId();
  const eventId = appState.selectedCulinaryEventId;

  if (!circleId || !eventId) {
    alert("Brak wybranego wydarzenia. Nie można zapisać potrawy.");
    return;
  }

  const name = document.getElementById("culinaryDishName").value.trim();
  if (!name) {
    alert("Podaj nazwę potrawy.");
    return;
  }

  const payload = {
    circle_id: circleId,
    event_id: eventId,
    name,
    prepared_by: document.getElementById("culinaryDishPreparedBy").value.trim() || null,
    ingredients: document.getElementById("culinaryDishIngredients").value.trim() || null,
    description: document.getElementById("culinaryDishDescription").value.trim() || null,
    notes: document.getElementById("culinaryDishNotes").value.trim() || null
  };

  if (appState.editingCulinaryDish) {
    const { error } = await appState.supabase
      .from("culinary_dishes")
      .update(payload)
      .eq("id", appState.editingCulinaryDish);

    if (error) {
      console.error(error);
      alert("Nie udało się zaktualizować potrawy.");
      return;
    }
  } else {
    const { error } = await appState.supabase
      .from("culinary_dishes")
      .insert([payload]);

    if (error) {
      console.error(error);
      alert("Nie udało się dodać potrawy.");
      return;
    }
  }

  hideCulinaryDishForm();
  await loadCulinaryEvents();
}

function handleShowCulinaryDishDetails(dishId) {
  appState.selectedCulinaryDishId = appState.selectedCulinaryDishId === dishId ? null : dishId;
  renderCulinaryDishesList();
}

function handleCloseCulinaryDishDetails() {
  appState.selectedCulinaryDishId = null;
  renderCulinaryDishesList();
}

function handleEditCulinaryDish(dishId) {
  const dishEntry = appState.culinaryDishes.find((item) => item.id === dishId);
  if (!dishEntry) return;
  showCulinaryDishForm(dishEntry);
}

async function handleDeleteCulinaryDish(dishId) {
  const dishEntry = appState.culinaryDishes.find((item) => item.id === dishId);
  if (!dishEntry) return;

  const confirmed = confirm(`Usunąć potrawę: ${dishEntry.name}?`);
  if (!confirmed) return;

  const { error } = await appState.supabase
    .from("culinary_dishes")
    .delete()
    .eq("id", dishId);

  if (error) {
    console.error(error);
    alert("Nie udało się usunąć potrawy.");
    return;
  }

  if (appState.selectedCulinaryDishId === dishId) {
    appState.selectedCulinaryDishId = null;
  }

  await loadCulinaryEvents();
}

function handlePrintCulinaryEvent(eventId) {
  const eventEntry = appState.culinaryEvents.find((item) => item.id === eventId);
  if (!eventEntry) return;

  const dishes = getDishesForEvent(eventId);
  const rows = dishes.map((dish) => `
    <tr>
      <td>${escapeHtml(dish.name || "-")}</td>
      <td>${escapeHtml(dish.prepared_by || "-")}</td>
      <td>${escapeHtml(dish.ingredients || "-")}</td>
      <td>${escapeHtml(dish.description || "-")}</td>
    </tr>
  `).join("");

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="pl">
    <head>
      <meta charset="UTF-8" />
      <title>${escapeHtml(eventEntry.title || "Kulinarne wspomnienie")}</title>
      <style>
        body { font-family: Arial, sans-serif; color: #222; margin: 32px; }
        h1 { margin-bottom: 4px; }
        .meta { color: #555; margin-bottom: 24px; }
        table { width: 100%; border-collapse: collapse; margin-top: 18px; }
        th, td { border: 1px solid #ddd; padding: 9px; text-align: left; vertical-align: top; }
        th { background: #f5f5f5; }
      </style>
    </head>
    <body>
      <h1>${escapeHtml(eventEntry.title || "Kulinarne wspomnienie")}</h1>
      <div class="meta">${escapeHtml(formatDate(eventEntry.event_date))}${eventEntry.place ? " • " + escapeHtml(eventEntry.place) : ""}</div>
      ${eventEntry.description ? `<p>${escapeHtml(eventEntry.description)}</p>` : ""}
      ${eventEntry.notes ? `<p><strong>Uwagi:</strong> ${escapeHtml(eventEntry.notes)}</p>` : ""}
      <h2>Potrawy</h2>
      <table>
        <thead>
          <tr>
            <th>Potrawa</th>
            <th>Przygotowała</th>
            <th>Składniki</th>
            <th>Opis</th>
          </tr>
        </thead>
        <tbody>${rows || `<tr><td colspan="4">Brak potraw.</td></tr>`}</tbody>
      </table>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

window.handleSelectCulinaryEvent = handleSelectCulinaryEvent;
window.handleEditCulinaryEvent = handleEditCulinaryEvent;
window.handleDeleteCulinaryEvent = handleDeleteCulinaryEvent;
window.handlePrintCulinaryEvent = handlePrintCulinaryEvent;
window.handleShowCulinaryDishDetails = handleShowCulinaryDishDetails;
window.handleCloseCulinaryDishDetails = handleCloseCulinaryDishDetails;
window.handleEditCulinaryDish = handleEditCulinaryDish;
window.handleDeleteCulinaryDish = handleDeleteCulinaryDish;


// =========================================================
// DOKUMENTY
// =========================================================

async function loadDocuments() {
  const circleId = getActiveCircleId();
  const listEl = document.getElementById("documentsList");
  const countLabel = document.getElementById("documentsCountLabel");

  if (!circleId) {
    if (listEl) {
      listEl.innerHTML = `<div class="module-card"><p class="muted">Brak przypisanego koła. Nie można wyświetlić dokumentów.</p></div>`;
    }
    if (countLabel) setText("documentsCountLabel", "0 dokumentów");
    return;
  }

  const { data, error } = await appState.supabase
    .from("documents")
    .select("*")
    .eq("circle_id", circleId)
    .order("document_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    if (listEl) {
      listEl.innerHTML = `<div class="module-card"><p class="muted">Nie udało się pobrać dokumentów. Spróbuj odświeżyć.</p></div>`;
    }
    return;
  }

  appState.documents = data || [];
  updateDocumentFilters();
  renderDocumentSummary();
  renderDocumentsList();

  if (countLabel) {
    setText("documentsCountLabel", `${appState.documents.length} dokumentów`);
  }
}

function updateDocumentFilters() {
  const years = [...new Set((appState.documents || [])
    .map((doc) => doc.document_date ? String(doc.document_date).substring(0, 4) : "")
    .filter(Boolean))]
    .sort((a, b) => Number(b) - Number(a));

  const types = [...new Set((appState.documents || [])
    .map((doc) => doc.document_type || "Inne")
    .filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "pl"));

  appState.documentYears = years;
  appState.documentTypes = types;
  renderDocumentFilterOptions();
}

function renderDocumentFilterOptions() {
  const typeSelect = document.getElementById("documentTypeFilter");
  const yearSelect = document.getElementById("documentYearFilter");

  if (typeSelect) {
    const previousValue = appState.documentFilterType || "all";
    typeSelect.innerHTML = `<option value="all">Wszystkie typy</option>`;
    appState.documentTypes.forEach((type) => {
      typeSelect.innerHTML += `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`;
    });
    typeSelect.value = appState.documentTypes.includes(previousValue) ? previousValue : "all";
    appState.documentFilterType = typeSelect.value;
  }

  if (yearSelect) {
    const previousValue = appState.documentFilterYear || "all";
    yearSelect.innerHTML = `<option value="all">Wszystkie lata</option>`;
    appState.documentYears.forEach((year) => {
      yearSelect.innerHTML += `<option value="${escapeHtml(year)}">${escapeHtml(year)}</option>`;
    });
    yearSelect.value = appState.documentYears.includes(previousValue) ? previousValue : "all";
    appState.documentFilterYear = yearSelect.value;
  }
}

function renderDocumentSummary() {
  const documents = appState.documents || [];
  const total = documents.length;
  const resolutions = documents.filter((doc) => normalizeText(doc.document_type) === "uchwała").length;
  const protocols = documents.filter((doc) => normalizeText(doc.document_type) === "protokół").length;
  const withFiles = documents.filter((doc) => Boolean(doc.file_url)).length;

  setText("documentsTotal", String(total));
  setText("documentsResolutions", String(resolutions));
  setText("documentsProtocols", String(protocols));
  setText("documentsWithFiles", String(withFiles));
}

function handleDocumentSearch(event) {
  appState.documentSearchTerm = event.target.value.trim().toLowerCase();
  renderDocumentsList();
}

function handleDocumentFilterChange() {
  appState.documentFilterType = document.getElementById("documentTypeFilter")?.value || "all";
  appState.documentFilterYear = document.getElementById("documentYearFilter")?.value || "all";
  renderDocumentsList();
}

function renderDocumentsList() {
  const listEl = document.getElementById("documentsList");
  if (!listEl) return;

  const searchTerm = appState.documentSearchTerm;
  const typeFilter = appState.documentFilterType;
  const yearFilter = appState.documentFilterYear;

  const visibleDocuments = (appState.documents || []).filter((doc) => {
    if (typeFilter !== "all" && (doc.document_type || "Inne") !== typeFilter) return false;
    if (yearFilter !== "all" && (!doc.document_date || String(doc.document_date).substring(0, 4) !== yearFilter)) return false;

    const text = [
      doc.document_date,
      doc.document_type,
      doc.title,
      doc.description,
      doc.file_url,
      doc.notes
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return !searchTerm || text.includes(searchTerm);
  });

  if (!visibleDocuments.length) {
    listEl.innerHTML = `<div class="module-card"><p class="muted">Brak pasujących dokumentów. Spróbuj zmienić wyszukiwanie, filtr albo dodaj pierwszy dokument.</p></div>`;
    return;
  }

  listEl.innerHTML = `
    <div class="table-wrapper">
      <table class="data-table documents-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Typ</th>
            <th>Tytuł</th>
            <th>Opis</th>
            <th>Plik</th>
            <th>Uwagi</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          ${visibleDocuments
            .map((doc) => {
              const hasFile = Boolean(doc.file_url);
              const linkCell = hasFile
                ? `<button type="button" onclick="window.handleOpenDocumentFile('${doc.id}')">Otwórz</button>`
                : `<button type="button" onclick="window.handleAddDocumentFile('${doc.id}')" class="secondary">Dodaj</button>`;

              return `
                <tr>
                  <td>${escapeHtml(formatDate(doc.document_date))}</td>
                  <td><span class="status-pill document-type-pill">${escapeHtml(doc.document_type || "Inne")}</span></td>
                  <td>
                    <span class="member-name">${escapeHtml(doc.title || "Bez tytułu")}</span>
                  </td>
                  <td>${escapeHtml(doc.description || "-")}</td>
                  <td>${linkCell}</td>
                  <td>${escapeHtml(doc.notes || "-")}</td>
                  <td class="table-actions">
                    <span class="actions-wrap">
                      <button type="button" onclick="window.handleEditDocument('${doc.id}')">Edytuj</button>
                      <button type="button" onclick="window.handleDeleteDocument('${doc.id}')" class="secondary">Usuń</button>
                    </span>
                  </td>
                </tr>`;
            })
            .join("")}
        </tbody>
      </table>
    </div>`;
}

function updateDocumentAttachmentUi() {
  const input = document.getElementById("documentFileUrl");
  const addBtn = document.getElementById("showDocumentLinkBtn");
  const openBtn = document.getElementById("openDocumentLinkBtn");
  const status = document.getElementById("documentAttachmentStatus");
  const filePath = input?.value?.trim() || "";

  if (status) {
    status.textContent = filePath ? "Plik dodany" : "Brak pliku";
  }

  if (openBtn) {
    openBtn.classList.toggle("hidden", !filePath);
  }

  if (addBtn) {
    addBtn.textContent = filePath ? "Zmień plik" : "Dodaj plik";
  }
}

function triggerDocumentFilePicker(targetDocumentId = null) {
  const input = document.getElementById("documentUploadInput");
  if (!input) return;

  appState.documentUploadTargetId = targetDocumentId;
  input.value = "";
  input.click();
}

async function handleDocumentFileSelected(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const circleId = getActiveCircleId();
  if (!circleId) {
    alert("Brak przypisanego koła. Nie można dodać pliku.");
    return;
  }

  const status = document.getElementById("documentAttachmentStatus");
  if (status) status.textContent = "Wgrywanie pliku...";

  const safeFileName = sanitizeFileName(file.name);
  const storagePath = `${circleId}/documents/${Date.now()}-${crypto.randomUUID()}-${safeFileName}`;

  const { error: uploadError } = await appState.supabase
    .storage
    .from("documents")
    .upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false
    });

  if (uploadError) {
    console.error(uploadError);
    alert("Nie udało się wgrać pliku. Sprawdź, czy w Supabase istnieje bucket documents i polityki dostępu.");
    updateDocumentAttachmentUi();
    return;
  }

  const targetDocumentId = appState.documentUploadTargetId;

  if (targetDocumentId) {
    const { error: updateError } = await appState.supabase
      .from("documents")
      .update({ file_url: storagePath })
      .eq("id", targetDocumentId);

    if (updateError) {
      console.error(updateError);
      alert("Plik został wgrany, ale nie udało się przypisać go do dokumentu.");
      appState.documentUploadTargetId = null;
      return;
    }

    appState.documentUploadTargetId = null;
    await loadDocuments();
    await loadDashboardStats();
    alert("Plik został dodany do dokumentu.");
    return;
  }

  const hiddenPathInput = document.getElementById("documentFileUrl");
  if (hiddenPathInput) hiddenPathInput.value = storagePath;

  updateDocumentAttachmentUi();
  alert("Plik został wgrany. Kliknij Zapisz, aby przypisać go do dokumentu.");
}

async function openCurrentDocumentFile() {
  const filePath = document.getElementById("documentFileUrl")?.value?.trim();

  if (!filePath) return;

  await openDocumentFilePath(filePath);
}

async function openDocumentFilePath(filePath) {
  if (!filePath) return;

  if (/^https?:\/\//i.test(filePath)) {
    window.open(filePath, "_blank", "noopener,noreferrer");
    return;
  }

  const { data, error } = await appState.supabase
    .storage
    .from("documents")
    .createSignedUrl(filePath, 60 * 10);

  if (error || !data?.signedUrl) {
    console.error(error);
    alert("Nie udało się otworzyć pliku. Sprawdź dostęp do Supabase Storage.");
    return;
  }

  window.open(data.signedUrl, "_blank", "noopener,noreferrer");
}

function sanitizeFileName(fileName) {
  const extensionSafe = String(fileName || "plik")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .replace(/Ł/g, "L")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return extensionSafe || "plik";
}

function showDocumentForm(documentEntry = null) {
  appState.editingDocument = documentEntry?.id || null;
  setText("documentFormTitle", documentEntry ? "Edycja dokumentu" : "Nowy dokument");

  document.getElementById("documentDate").value = documentEntry?.document_date || new Date().toISOString().split("T")[0];
  document.getElementById("documentType").value = documentEntry?.document_type || "Inne";
  document.getElementById("documentTitle").value = documentEntry?.title || "";
  document.getElementById("documentDescription").value = documentEntry?.description || "";
  document.getElementById("documentFileUrl").value = documentEntry?.file_url || "";
  document.getElementById("documentNotes").value = documentEntry?.notes || "";

  updateDocumentAttachmentUi();

  document.getElementById("documentFormBox").classList.remove("hidden");
  document.getElementById("documentTitle").focus();
}

function hideDocumentForm() {
  appState.editingDocument = null;
  document.getElementById("documentForm").reset();
  updateDocumentAttachmentUi();
  document.getElementById("documentFormBox").classList.add("hidden");
}

async function handleDocumentFormSubmit(event) {
  event.preventDefault();

  const circleId = getActiveCircleId();
  if (!circleId) {
    alert("Brak przypisanego koła. Nie można zapisać dokumentu.");
    return;
  }

  const documentDate = document.getElementById("documentDate").value || null;
  const documentType = document.getElementById("documentType").value || "Inne";
  const title = document.getElementById("documentTitle").value.trim();
  const description = document.getElementById("documentDescription").value.trim();
  const fileUrl = document.getElementById("documentFileUrl").value.trim();
  const notes = document.getElementById("documentNotes").value.trim();

  if (!title) {
    alert("Podaj tytuł dokumentu.");
    return;
  }

  const payload = {
    circle_id: circleId,
    document_date: documentDate,
    title,
    document_type: documentType,
    description: description || null,
    file_url: fileUrl || null,
    notes: notes || null
  };

  if (appState.editingDocument) {
    const { error } = await appState.supabase
      .from("documents")
      .update(payload)
      .eq("id", appState.editingDocument);

    if (error) {
      console.error(error);
      alert("Nie udało się zaktualizować dokumentu.");
      return;
    }
  } else {
    const { error } = await appState.supabase.from("documents").insert([payload]);

    if (error) {
      console.error(error);
      alert("Nie udało się dodać dokumentu.");
      return;
    }
  }

  hideDocumentForm();
  await loadDocuments();
  await loadDashboardStats();
}

function handleEditDocument(documentId) {
  const documentEntry = appState.documents.find((item) => item.id === documentId);
  if (!documentEntry) return;
  showDocumentForm(documentEntry);
}

function handleAddDocumentFile(documentId) {
  const documentEntry = appState.documents.find((item) => item.id === documentId);
  if (!documentEntry) return;
  triggerDocumentFilePicker(documentId);
}

async function handleOpenDocumentFile(documentId) {
  const documentEntry = appState.documents.find((item) => item.id === documentId);
  if (!documentEntry?.file_url) return;
  await openDocumentFilePath(documentEntry.file_url);
}

async function handleDeleteDocument(documentId) {
  const documentEntry = appState.documents.find((item) => item.id === documentId);
  if (!documentEntry) return;

  const confirmed = confirm(`Usunąć dokument: ${documentEntry.title}?`);
  if (!confirmed) return;

  const { error } = await appState.supabase
    .from("documents")
    .delete()
    .eq("id", documentId);

  if (error) {
    console.error(error);
    alert("Nie udało się usunąć dokumentu.");
    return;
  }

  if (documentEntry.file_url && !/^https?:\/\//i.test(documentEntry.file_url)) {
    const { error: storageError } = await appState.supabase
      .storage
      .from("documents")
      .remove([documentEntry.file_url]);

    if (storageError) {
      console.warn("Nie udało się usunąć pliku z Storage:", storageError);
    }
  }

  await loadDocuments();
  await loadDashboardStats();
}

window.handleEditDocument = handleEditDocument;
window.handleAddDocumentFile = handleAddDocumentFile;
window.handleOpenDocumentFile = handleOpenDocumentFile;
window.handleDeleteDocument = handleDeleteDocument;


// =========================================================
// ADMINISTRACJA / SUPER ADMIN - KOŁA
// =========================================================

function showActiveCircleForm() {
  const circle = getActiveCircle();
  if (!circle) {
    alert("Brak aktywnego koła do edycji.");
    return;
  }

  setInputValue("circleNameInput", circle.name || "");
  setInputValue("circleShortNameInput", circle.short_name || "");
  setInputValue("circleStatusInput", circle.status || "active");
  setInputValue("circleFeeInput", circle.membership_fee_amount ?? 0);
  setInputValue("circleEmailInput", circle.contact_email || "");
  setInputValue("circlePhoneInput", circle.contact_phone || "");
  setInputValue("circleNotesInput", circle.notes || "");

  document.getElementById("activeCircleFormBox")?.classList.remove("hidden");
}

function hideActiveCircleForm() {
  document.getElementById("activeCircleFormBox")?.classList.add("hidden");
}

async function handleActiveCircleFormSubmit(event) {
  event.preventDefault();

  const circleId = getActiveCircleId();
  if (!circleId) {
    alert("Brak aktywnego koła.");
    return;
  }

  const payload = {
    name: document.getElementById("circleNameInput")?.value.trim(),
    short_name: document.getElementById("circleShortNameInput")?.value.trim() || null,
    status: document.getElementById("circleStatusInput")?.value || "active",
    membership_fee_amount: Number(document.getElementById("circleFeeInput")?.value || 0),
    contact_email: document.getElementById("circleEmailInput")?.value.trim() || null,
    contact_phone: document.getElementById("circlePhoneInput")?.value.trim() || null,
    notes: document.getElementById("circleNotesInput")?.value.trim() || null
  };

  if (!payload.name) {
    alert("Nazwa koła jest wymagana.");
    return;
  }

  const { error } = await appState.supabase
    .from("circles")
    .update(payload)
    .eq("id", circleId);

  if (error) {
    console.error(error);
    alert("Nie udało się zapisać danych koła. Sprawdź uprawnienia.");
    return;
  }

  hideActiveCircleForm();
  await loadAvailableCircles();
  appState.circle = getActiveCircle();
  renderUserInfo();
  renderSuperAdminUi();
  setDefaultContributionGeneratorValues();
  alert("Dane koła zostały zapisane.");
}

function showCircleForm(circleId = null) {
  if (!isSuperAdmin()) return;

  const circle = circleId ? appState.availableCircles.find((item) => item.id === circleId) : null;
  appState.editingCircle = circle || null;

  setText("circleFormTitle", circle ? "Edytuj koło" : "Dodaj koło");
  setInputValue("circleIdInput", circle?.id || "");
  setInputValue("managedCircleNameInput", circle?.name || "");
  setInputValue("managedCircleShortNameInput", circle?.short_name || "");
  setInputValue("managedCircleStatusInput", circle?.status || "active");
  setInputValue("managedCircleFeeInput", circle?.membership_fee_amount ?? 10);
  setInputValue("managedCircleEmailInput", circle?.contact_email || "");
  setInputValue("managedCirclePhoneInput", circle?.contact_phone || "");
  setInputValue("managedCircleNotesInput", circle?.notes || "");

  document.getElementById("circleFormBox")?.classList.remove("hidden");
}

function hideCircleForm() {
  appState.editingCircle = null;
  document.getElementById("circleFormBox")?.classList.add("hidden");
}

async function handleCircleFormSubmit(event) {
  event.preventDefault();

  if (!isSuperAdmin()) {
    alert("Tylko Super Admin może zarządzać kołami.");
    return;
  }

  const circleId = document.getElementById("circleIdInput")?.value || "";
  const payload = {
    name: document.getElementById("managedCircleNameInput")?.value.trim(),
    short_name: document.getElementById("managedCircleShortNameInput")?.value.trim() || null,
    status: document.getElementById("managedCircleStatusInput")?.value || "active",
    membership_fee_amount: Number(document.getElementById("managedCircleFeeInput")?.value || 0),
    contact_email: document.getElementById("managedCircleEmailInput")?.value.trim() || null,
    contact_phone: document.getElementById("managedCirclePhoneInput")?.value.trim() || null,
    notes: document.getElementById("managedCircleNotesInput")?.value.trim() || null
  };

  if (!payload.name) {
    alert("Nazwa koła jest wymagana.");
    return;
  }

  let result;

  if (circleId) {
    result = await appState.supabase
      .from("circles")
      .update(payload)
      .eq("id", circleId);
  } else {
    result = await appState.supabase
      .from("circles")
      .insert(payload)
      .select("id")
      .single();
  }

  if (result.error) {
    console.error(result.error);
    alert("Nie udało się zapisać koła.");
    return;
  }

  hideCircleForm();
  await loadAvailableCircles();

  if (!circleId && result.data?.id) {
    appState.activeCircleId = result.data.id;
    localStorage.setItem("panelKGW.activeCircleId", result.data.id);
  }

  appState.circle = getActiveCircle();
  renderUserInfo();
  renderSuperAdminUi();
  await loadAllCircleData();
  alert("Koło zostało zapisane.");
}

function renderCirclesList() {
  const list = document.getElementById("circlesList");
  if (!list) return;

  if (!isSuperAdmin()) {
    list.innerHTML = "";
    return;
  }

  if (!appState.availableCircles.length) {
    list.innerHTML = `<tr><td colspan="5">Brak kół w programie.</td></tr>`;
    return;
  }

  list.innerHTML = appState.availableCircles.map((circle) => {
    const isActive = circle.id === getActiveCircleId();
    const statusText = circleStatusLabel(circle.status);
    const contact = [circle.contact_email, circle.contact_phone].filter(Boolean).join("<br>") || "-";

    return `
      <tr class="${isActive ? "selected-row" : ""}">
        <td>
          <span class="member-name">${escapeHtml(circle.name)}</span>
          ${circle.short_name ? `<span class="table-note">${escapeHtml(circle.short_name)}</span>` : ""}
        </td>
        <td><span class="status-pill ${circleStatusClass(circle.status)}">${statusText}</span></td>
        <td class="amount-cell">${formatMoney(circle.membership_fee_amount || 0)}</td>
        <td>${contact}</td>
        <td class="table-actions">
          <button type="button" onclick="switchToCircle('${circle.id}')">Przełącz</button>
          <button type="button" class="secondary" onclick="showCircleForm('${circle.id}')">Edytuj</button>
          <button type="button" class="secondary" onclick="toggleCircleStatus('${circle.id}')">
            ${circle.status === "active" ? "Zablokuj" : "Aktywuj"}
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

async function switchToCircle(circleId) {
  if (!isSuperAdmin()) return;
  appState.activeCircleId = circleId;
  appState.circle = getActiveCircle();
  localStorage.setItem("panelKGW.activeCircleId", circleId);

  renderUserInfo();
  renderSuperAdminUi();
  await loadAllCircleData();
  showView("dashboard");
}

async function toggleCircleStatus(circleId) {
  if (!isSuperAdmin()) return;

  const circle = appState.availableCircles.find((item) => item.id === circleId);
  if (!circle) return;

  const newStatus = circle.status === "active" ? "blocked" : "active";

  const { error } = await appState.supabase
    .from("circles")
    .update({ status: newStatus })
    .eq("id", circleId);

  if (error) {
    console.error(error);
    alert("Nie udało się zmienić statusu koła.");
    return;
  }

  await loadAvailableCircles();
  appState.circle = getActiveCircle();
  renderUserInfo();
  renderSuperAdminUi();
}

function circleStatusLabel(status) {
  const labels = {
    active: "Aktywne",
    blocked: "Zablokowane",
    archived: "Archiwalne"
  };

  return labels[status] || status || "-";
}

function circleStatusClass(status) {
  if (status === "active") return "status-active";
  if (status === "blocked") return "status-cancelled";
  return "status-inactive";
}

window.showCircleForm = showCircleForm;
window.switchToCircle = switchToCircle;
window.toggleCircleStatus = toggleCircleStatus;


function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function formatDate(value) {
  if (!value) return "-";
  return String(value);
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"]/g, (match) => {
    const escape = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;"
    };
    return escape[match] || match;
  });
}

function showLogin() {
  document.getElementById("loginView").classList.remove("hidden");
  document.getElementById("panelView").classList.add("hidden");
}

function showPanel() {
  document.getElementById("loginView").classList.add("hidden");
  document.getElementById("panelView").classList.remove("hidden");
  showView("dashboard");
}

function showView(viewName) {
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === viewName);
  });

  document.querySelectorAll(".view").forEach((view) => {
    view.classList.remove("active-view");
  });

  const viewEl = document.getElementById(`${viewName}View`);
  if (viewEl) {
    viewEl.classList.add("active-view");
  }
}

function showLoginError(message) {
  setText("loginError", message);
}

function clearLoginError() {
  setText("loginError", "");
}

function setInputValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value ?? "";
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text ?? "";
}

function roleLabel(role) {
  const labels = {
    super_admin: "Super Admin",
    circle_admin: "Administrator koła",
    staff: "Pracownik / Zarząd",
    accountant_readonly: "Księgowa / podgląd"
  };

  return labels[role] || role || "Użytkownik";
}

function formatMoney(value) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN"
  }).format(Number(value || 0));
}