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
  documentUploadTargetId: null,
  circleUserSlots: [],
  editingCircleUserSlot: null,
  userActivationRequests: [],
  editingActivationSlot: null
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
  setText("superAdminVersion", version);
  setText("helpVersion", version);
}

function setupSupabase() {
  if (!window.supabase) {
    showToast("Nie załadowano biblioteki Supabase.");
    return;
  }

  if (!config.SUPABASE_URL || !config.SUPABASE_KEY || config.SUPABASE_KEY.includes("TU_WKLEJ")) {
    showToast("Uzupełnij config.js: SUPABASE_URL i SUPABASE_KEY.");
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
  const exportMembersExcelBtn = document.getElementById("exportMembersExcelBtn");
  const printMembersBtn = document.getElementById("printMembersBtn");
  const memberSearch = document.getElementById("memberSearch");
  const memberForm = document.getElementById("memberForm");
  const cancelMemberBtn = document.getElementById("cancelMemberBtn");
  const cancelMemberSubmitBtn = document.getElementById("cancelMemberSubmitBtn");
  const newContributionBtn = document.getElementById("newContributionBtn");
  const refreshContributionsBtn = document.getElementById("refreshContributionsBtn");
  const exportContributionsExcelBtn = document.getElementById("exportContributionsExcelBtn");
  const printContributionsBtn = document.getElementById("printContributionsBtn");
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
  const adminContactBtn = document.getElementById("adminContactBtn");
  const adminContactCloseBtn = document.getElementById("adminContactCloseBtn");
  const adminContactCloseX = document.getElementById("adminContactCloseX");
  const adminContactModal = document.getElementById("adminContactModal");
  const newCircleUserBtn = document.getElementById("newCircleUserBtn");
  const circleUserForm = document.getElementById("circleUserForm");
  const cancelCircleUserBtn = document.getElementById("cancelCircleUserBtn");
  const refreshCircleUsersBtn = document.getElementById("refreshCircleUsersBtn");
  const activationRequestForm = document.getElementById("activationRequestForm");
  const cancelActivationRequestBtn = document.getElementById("cancelActivationRequestBtn");
  const refreshActivationRequestsBtn = document.getElementById("refreshActivationRequestsBtn");
  const cancelCircleUserSlotBtn = document.getElementById("cancelCircleUserSlotBtn");
  const uploadCircleLogoBtn = document.getElementById("uploadCircleLogoBtn");
  const removeCircleLogoBtn = document.getElementById("removeCircleLogoBtn");
  const circleLogoUploadInput = document.getElementById("circleLogoUploadInput");

  loginForm?.addEventListener("submit", handleLogin);
  logoutBtn?.addEventListener("click", handleLogout);
  refreshDashboardBtn?.addEventListener("click", loadDashboardStats);
  newMemberBtn?.addEventListener("click", () => showMemberForm());
  refreshMembersBtn?.addEventListener("click", loadMembers);
  exportMembersExcelBtn?.addEventListener("click", exportMembersToExcel);
  printMembersBtn?.addEventListener("click", printMembersList);
  memberSearch?.addEventListener("input", handleMemberSearch);
  memberForm?.addEventListener("submit", handleMemberFormSubmit);
  cancelMemberBtn?.addEventListener("click", hideMemberForm);
  cancelMemberSubmitBtn?.addEventListener("click", hideMemberForm);
  newContributionBtn?.addEventListener("click", () => showContributionForm());
  refreshContributionsBtn?.addEventListener("click", loadContributions);
  exportContributionsExcelBtn?.addEventListener("click", exportContributionsToExcel);
  printContributionsBtn?.addEventListener("click", printContributionsList);
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
  manageCirclesBtn?.addEventListener("click", () => showView("superAdmin"));
  editActiveCircleBtn?.addEventListener("click", showActiveCircleForm);
  activeCircleForm?.addEventListener("submit", handleActiveCircleFormSubmit);
  cancelActiveCircleEditBtn?.addEventListener("click", hideActiveCircleForm);
  newCircleBtn?.addEventListener("click", () => showCircleForm());
  circleForm?.addEventListener("submit", handleCircleFormSubmit);
  cancelCircleBtn?.addEventListener("click", hideCircleForm);
  adminContactBtn?.addEventListener("click", showAdminContactModal);
  adminContactCloseBtn?.addEventListener("click", hideAdminContactModal);
  adminContactCloseX?.addEventListener("click", hideAdminContactModal);
  adminContactModal?.addEventListener("click", (event) => {
    if (event.target === adminContactModal) hideAdminContactModal();
  });
  newCircleUserBtn?.addEventListener("click", showExtraUserSlotForm);
  circleUserForm?.addEventListener("submit", handleCircleUserFormSubmit);
  cancelCircleUserBtn?.addEventListener("click", hideCircleUserForm);
  cancelCircleUserSlotBtn?.addEventListener("click", hideCircleUserForm);
  refreshCircleUsersBtn?.addEventListener("click", loadCircleUsers);
  activationRequestForm?.addEventListener("submit", handleActivationRequestSubmit);
  cancelActivationRequestBtn?.addEventListener("click", hideActivationRequestForm);
  refreshActivationRequestsBtn?.addEventListener("click", loadActivationRequests);
  uploadCircleLogoBtn?.addEventListener("click", triggerCircleLogoUpload);
  removeCircleLogoBtn?.addEventListener("click", removeCircleLogo);
  circleLogoUploadInput?.addEventListener("change", handleCircleLogoSelected);

  document.querySelectorAll(".help-tab").forEach((btn) => {
    btn.addEventListener("click", () => showHelpTab(btn.dataset.helpTab));
  });

  const newFinanceEntryBtn = document.getElementById("newFinanceEntryBtn");
  const refreshFinanceBtn = document.getElementById("refreshFinanceBtn");
  const exportFinanceExcelBtn = document.getElementById("exportFinanceExcelBtn");
  const printFinanceBtn = document.getElementById("printFinanceBtn");
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
  exportFinanceExcelBtn?.addEventListener("click", exportFinanceToExcel);
  printFinanceBtn?.addEventListener("click", printFinanceList);
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
    showToast("Nie udało się pobrać profilu użytkownika. Sprawdź tabelę profiles i RLS.");
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

function canWriteData() {
  return ["super_admin", "circle_admin", "staff"].includes(appState.profile?.role);
}

function canManageCircleSettings() {
  return ["super_admin", "circle_admin"].includes(appState.profile?.role);
}

function canManageUsers() {
  return ["super_admin", "circle_admin"].includes(appState.profile?.role);
}

function isReadonlyUser() {
  return appState.profile?.role === "accountant_readonly";
}

function getCurrentUserEmail() {
  return appState.user?.email || appState.profile?.email || "";
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
      .select("id, name, short_name, status, membership_fee_amount, storage_limit_mb, logo_url, contact_email, contact_phone, notes")
      .order("name", { ascending: true });

    if (error) {
      console.error(error);
      showToast("Nie udało się pobrać listy kół.");
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
    .select("id, name, short_name, status, membership_fee_amount, storage_limit_mb, logo_url, contact_email, contact_phone, notes")
    .eq("id", appState.profile.circle_id)
    .single();

  if (error) {
    console.error(error);
    showToast("Nie udało się pobrać danych koła.");
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
  hideActivationRequestForm();

  await loadDashboardStats();
  await loadMembers();
  await loadContributions();
  await loadFinances();
  await loadCulinaryEvents();
  await loadDocuments();
  await loadCircleUsers();
  await loadActivationRequests();
  renderCirclesList();
  updatePermissionUi();
}

function renderUserInfo() {
  const profile = appState.profile;
  const circle = getActiveCircle();
  appState.circle = circle;

  setText("circleName", circle?.name || "Panel KGW");
  setText("userRole", "Administrator");
  setText("adminRole", roleLabel(profile?.role));
  setText("adminCircleId", getActiveCircleId() || "Brak aktywnego koła");
  renderCircleLogos();
  updatePermissionUi();
}

function updatePermissionUi() {
  const writable = canWriteData();
  const circleSettings = canManageCircleSettings();
  const usersAdmin = canManageUsers();

  const writeIds = [
    "newMemberBtn",
    "newContributionBtn",
    "generateContributionsBtn",
    "newFinanceEntryBtn",
    "newCulinaryEventBtn",
    "newCulinaryDishBtn",
    "newDocumentBtn",
    "insertTestDataBtn",
    "clearTestDataBtn"
  ];

  writeIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle("hidden", !writable);
  });

  document.querySelectorAll(".action-grid button").forEach((btn) => {
    btn.classList.toggle("hidden", !writable);
  });

  document.getElementById("editActiveCircleBtn")?.classList.toggle("hidden", !circleSettings);
  document.getElementById("activeCircleFormBox")?.classList.toggle("hidden", true);

  document.getElementById("circleUsersSection")?.classList.toggle("hidden", !usersAdmin);
}

function renderSuperAdminUi() {
  const superBar = document.getElementById("superAdminBar");
  const section = document.getElementById("superAdminCirclesSection");
  const select = document.getElementById("activeCircleSelect");
  const navBtn = document.getElementById("superAdminNavBtn");

  if (!isSuperAdmin()) {
    superBar?.classList.add("hidden");
    section?.classList.add("hidden");
    navBtn?.classList.add("hidden");
    return;
  }

  superBar?.classList.remove("hidden");
  section?.classList.remove("hidden");
  navBtn?.classList.remove("hidden");

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

function getVisibleContributions() {
  const searchTerm = appState.contributionSearchTerm;
  const statusFilter = appState.contributionFilterStatus;
  const yearFilter = appState.contributionFilterYear;

  return (appState.contributions || []).filter((entry) => {
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
}

function renderContributionsList() {
  const listEl = document.getElementById("contributionsList");
  if (!listEl) return;

  const visibleContributions = getVisibleContributions();

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

              const payButton = canWriteData() && entry.status === "due"
                ? `<button type="button" onclick="window.markContributionPaid('${entry.id}')">Oznacz jako zapłacone</button>`
                : "";
              const contributionActions = canWriteData()
                ? `${payButton}
                    <button type="button" onclick="window.handleEditContribution('${entry.id}')">Edytuj</button>
                    <button type="button" onclick="window.handleCancelContribution('${entry.id}')" class="secondary">Anuluj wpis</button>`
                : `<span class="muted">Podgląd</span>`;

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
                    ${contributionActions}
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
    showToast("Brak przypisanego koła. Nie można zapisać składki.");
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
    showToast("Wybierz członka do przypisania składki.");
    return;
  }
  if (!year || !month || Number.isNaN(amount)) {
    showToast("Podaj poprawny rok, miesiąc i kwotę składki.");
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
      showToast("Nie udało się zaktualizować składki.");
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
      showToast("Nie udało się dodać składki.");
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
    showToast("Brak przypisanego koła.");
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
    showToast("Brak aktywnych członków.");
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
    showToast("Błąd przy sprawdzaniu istniejących składek.");
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
  showToast(`Utworzono ${created} składek. Pominięto ${skipped} istniejących wpisów.`);

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
    showToast("Nie udało się oznaczyć składki jako zapłacone.");
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
    showToast("Nie udało się anulować wpisu składki.");
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


function exportMembersToExcel() {
  const members = getVisibleMembers();

  if (!members.length) {
    showToast("Brak członków do eksportu.", "info");
    return;
  }

  const rows = members.map((member) => ({
    "Imię": member.first_name || "",
    "Nazwisko": member.last_name || "",
    "Telefon": member.phone || "",
    "E-mail": member.email || "",
    "Funkcja": member.function_in_circle || "",
    "Status": member.member_status === "inactive" ? "Nieaktywna" : "Aktywna",
    "Notatka": member.notes || ""
  }));

  exportRowsToXlsx(rows, "Członkowie", `czlonkowie_${getSafeCircleName()}_${todayIso()}.xlsx`);
}

function exportContributionsToExcel() {
  const contributions = getVisibleContributions();

  if (!contributions.length) {
    showToast("Brak składek do eksportu.", "info");
    return;
  }

  const rows = contributions.map((entry) => {
    const member = appState.members.find((memberItem) => memberItem.id === entry.member_id);
    const memberName = member ? `${member.first_name} ${member.last_name}` : "Nieznany członek";
    const periodLabel = entry.period_label || `${monthLabel(entry.contribution_month)} ${entry.contribution_year}`;

    return {
      "Członek": memberName,
      "Rok": entry.contribution_year || "",
      "Miesiąc": entry.contribution_month || "",
      "Okres": periodLabel || "",
      "Kwota": Number(entry.amount || 0),
      "Status": contributionStatusLabel(entry.status),
      "Forma płatności": contributionPaymentMethodLabel(entry.payment_method),
      "Data wpłaty": entry.paid_at || "",
      "Notatka": entry.notes || ""
    };
  });

  exportRowsToXlsx(rows, "Składki", `skladki_${getSafeCircleName()}_${todayIso()}.xlsx`);
}

function exportFinanceToExcel() {
  const finances = getVisibleFinances();

  if (!finances.length) {
    showToast("Brak wpisów finansowych do eksportu.", "info");
    return;
  }

  const rows = finances.map((entry) => ({
    "Data": entry.entry_date || "",
    "Typ": entry.type === "income" ? "Wpływ" : "Wydatek",
    "Kategoria": entry.category || "",
    "Opis": entry.description || "",
    "Metoda płatności": financePaymentMethodLabel(entry.payment_method),
    "Kwota": entry.type === "expense" ? -Number(entry.amount || 0) : Number(entry.amount || 0),
    "Status": entry.status === "active" ? "Aktywny" : "Anulowany",
    "Źródło": financeSourceLabel(entry.source_type),
    "Notatka": entry.notes || ""
  }));

  exportRowsToXlsx(rows, "Finanse", `finanse_${getSafeCircleName()}_${todayIso()}.xlsx`);
}


function printMembersList() {
  const members = getVisibleMembers();

  if (!members.length) {
    showToast("Brak członków do wydruku.", "info");
    return;
  }

  const rows = members.map((member) => [
    `${member.first_name || ""} ${member.last_name || ""}`.trim(),
    member.phone || "",
    member.email || "",
    member.function_in_circle || "",
    member.member_status === "inactive" ? "Nieaktywna" : "Aktywna",
    member.notes || ""
  ]);

  openPrintReport({
    title: "Lista członków",
    subtitle: `${members.length} osób`,
    headers: ["Członek", "Telefon", "E-mail", "Funkcja", "Status", "Notatka"],
    rows
  });
}

function printContributionsList() {
  const contributions = getVisibleContributions();

  if (!contributions.length) {
    showToast("Brak składek do wydruku.", "info");
    return;
  }

  const paidTotal = contributions
    .filter((entry) => entry.status === "paid")
    .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const dueEntries = contributions.filter((entry) => entry.status === "due");
  const dueTotal = dueEntries.reduce((sum, entry) => sum + Number(entry.amount || 0), 0);

  const rows = contributions.map((entry) => {
    const member = appState.members.find((memberItem) => memberItem.id === entry.member_id);
    const memberName = member ? `${member.first_name} ${member.last_name}` : "Nieznany członek";
    const periodLabel = entry.period_label || `${monthLabel(entry.contribution_month)} ${entry.contribution_year}`;

    return [
      memberName,
      entry.contribution_year || "",
      entry.contribution_month || "",
      periodLabel || "",
      formatMoney(Number(entry.amount || 0)),
      contributionStatusLabel(entry.status),
      contributionPaymentMethodLabel(entry.payment_method),
      entry.paid_at || "",
      entry.notes || ""
    ];
  });

  openPrintReport({
    title: "Zestawienie składek",
    subtitle: `Zapłacone: ${formatMoney(paidTotal)} • Zaległe: ${formatMoney(dueTotal)} • Liczba zaległości: ${dueEntries.length}`,
    headers: ["Członek", "Rok", "Miesiąc", "Okres", "Kwota", "Status", "Płatność", "Data wpłaty", "Notatka"],
    rows,
    numericColumns: [4]
  });
}

function printFinanceList() {
  const finances = getVisibleFinances();

  if (!finances.length) {
    showToast("Brak wpisów finansowych do wydruku.", "info");
    return;
  }

  const activeEntries = finances.filter((entry) => entry.status === "active");
  const income = activeEntries
    .filter((entry) => entry.type === "income")
    .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const expenses = activeEntries
    .filter((entry) => entry.type === "expense")
    .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const balance = income - expenses;

  const rows = finances.map((entry) => [
    entry.entry_date || "",
    entry.type === "income" ? "Wpływ" : "Wydatek",
    entry.category || "",
    entry.description || "",
    financePaymentMethodLabel(entry.payment_method),
    entry.type === "expense" ? `-${formatMoney(Number(entry.amount || 0))}` : formatMoney(Number(entry.amount || 0)),
    entry.status === "active" ? "Aktywny" : "Anulowany",
    financeSourceLabel(entry.source_type),
    entry.notes || ""
  ]);

  openPrintReport({
    title: "Zestawienie finansów",
    subtitle: `Saldo: ${formatMoney(balance)} • Wpływy: ${formatMoney(income)} • Wydatki: ${formatMoney(expenses)}`,
    headers: ["Data", "Typ", "Kategoria", "Opis", "Metoda", "Kwota", "Status", "Źródło", "Notatka"],
    rows,
    numericColumns: [5]
  });
}

function openPrintReport({ title, subtitle = "", headers, rows, numericColumns = [] }) {
  const circle = getActiveCircle();
  const circleName = circle?.name || "Panel KGW";
  const generatedAt = new Date().toLocaleString("pl-PL");
  const safeTitle = escapeHtml(title);
  const safeCircle = escapeHtml(circleName);
  const safeSubtitle = escapeHtml(subtitle);
  const logoUrl = getLogoUrl(getCircleLogoPath(circle));
  const logoHtml = logoUrl
    ? `<img class="print-logo" src="${escapeHtml(logoUrl)}" alt="Logo koła" />`
    : `<div class="print-logo print-logo-fallback">${escapeHtml(circleInitials(circle))}</div>`;

  const headerHtml = headers
    .map((header, index) => `<th class="${numericColumns.includes(index) ? "numeric" : ""}">${escapeHtml(header)}</th>`)
    .join("");

  const rowsHtml = rows
    .map((row) => `
      <tr>
        ${row
          .map((cell, index) => `<td class="${numericColumns.includes(index) ? "numeric" : ""}">${escapeHtml(cell)}</td>`)
          .join("")}
      </tr>
    `)
    .join("");

  const html = `
    <!DOCTYPE html>
    <html lang="pl">
    <head>
      <meta charset="UTF-8" />
      <title>${safeTitle} - ${safeCircle}</title>
      <style>
        @page {
          size: A4 landscape;
          margin: 12mm;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          color: #243024;
          font-family: Arial, sans-serif;
          font-size: 12px;
        }

        .print-header {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: flex-start;
          border-bottom: 2px solid #6f8f72;
          padding-bottom: 10px;
          margin-bottom: 14px;
        }

        .print-title-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .print-logo {
          width: 54px;
          height: 54px;
          object-fit: contain;
          border: 1px solid #d8d1c2;
          border-radius: 14px;
          background: #fbfaf6;
          padding: 4px;
          flex: 0 0 auto;
        }

        .print-logo-fallback {
          display: grid;
          place-items: center;
          color: #4f6f55;
          font-weight: 900;
          font-size: 14px;
          padding: 0;
        }

        .brand {
          color: #4f6f55;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-size: 11px;
        }

        h1 {
          margin: 4px 0 4px;
          font-size: 22px;
        }

        .meta {
          color: #6c756a;
          line-height: 1.45;
          text-align: right;
        }

        .subtitle {
          margin: 0 0 12px;
          padding: 8px 10px;
          border: 1px solid #e5dfd1;
          border-radius: 8px;
          background: #fbfaf6;
          color: #4f6f55;
          font-weight: 700;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          background: #e5eee4;
          color: #243024;
          font-weight: 800;
          text-align: left;
        }

        th,
        td {
          border: 1px solid #d8d1c2;
          padding: 7px 8px;
          vertical-align: top;
          word-break: break-word;
        }

        tbody tr:nth-child(even) {
          background: #fbfaf6;
        }

        .numeric {
          text-align: right;
          white-space: nowrap;
        }

        .footer {
          margin-top: 12px;
          color: #7a8276;
          font-size: 10px;
        }

        @media print {
          .no-print {
            display: none !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="print-header">
        <div class="print-title-wrap">
          ${logoHtml}
          <div>
            <div class="brand">Panel KGW</div>
            <h1>${safeTitle}</h1>
            <div>${safeCircle}</div>
          </div>
        </div>
        <div class="meta">
          Data wydruku:<br />
          <strong>${escapeHtml(generatedAt)}</strong>
        </div>
      </div>

      ${safeSubtitle ? `<div class="subtitle">${safeSubtitle}</div>` : ""}

      <table>
        <thead>
          <tr>${headerHtml}</tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>

      <div class="footer">Wygenerowano w systemie Panel KGW.</div>

      <script>
        window.addEventListener("load", () => {
          window.print();
        });
      </script>
    </body>
    </html>
  `;

  const printWindow = window.open("", "_blank", "width=1200,height=800");

  if (!printWindow) {
    showToast("Przeglądarka zablokowała okno wydruku. Zezwól na wyskakujące okna i spróbuj ponownie.", "error");
    return;
  }

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}


function exportRowsToXlsx(rows, sheetName, fileName) {
  if (!window.XLSX) {
    showToast("Nie udało się załadować biblioteki eksportu Excel. Odśwież stronę i spróbuj ponownie.", "error");
    return;
  }

  const worksheet = window.XLSX.utils.json_to_sheet(rows);
  const headers = Object.keys(rows[0] || {});
  worksheet["!cols"] = headers.map((header) => ({ wch: Math.min(Math.max(String(header).length + 8, 14), 34) }));

  const workbook = window.XLSX.utils.book_new();
  window.XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  window.XLSX.writeFile(workbook, fileName);

  showToast(`Wyeksportowano plik Excel: ${fileName}`, "success");
}

function getSafeCircleName() {
  const circle = getActiveCircle();
  return sanitizeFileName(circle?.short_name || circle?.name || "KGW");
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function sanitizeFileName(value) {
  return String(value || "KGW")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .replace(/Ł/g, "L")
    .replace(/[^a-zA-Z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60) || "KGW";
}

function getVisibleMembers() {
  const searchTerm = appState.memberSearchTerm;

  return (appState.members || []).filter((member) => {
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
}

function renderMembersList() {
  const listEl = document.getElementById("membersList");
  if (!listEl) return;

  const visibleMembers = getVisibleMembers();

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

              const actions = canWriteData()
                ? `<button type="button" onclick="window.handleEditMember('${member.id}')">Edytuj</button>
                   <button type="button" onclick="window.handleToggleMemberStatus('${member.id}')" class="secondary">${toggleLabel}</button>`
                : `<span class="muted">Podgląd</span>`;

              return `
                <tr>
                  <td><span class="member-name">${escapeHtml(member.first_name)} ${escapeHtml(member.last_name)}</span></td>
                  <td>${escapeHtml(member.phone || "-")}</td>
                  <td>${escapeHtml(member.email || "-")}</td>
                  <td>${escapeHtml(member.function_in_circle || "-")}</td>
                  <td><span class="status-pill ${statusClass}">${statusLabel}</span></td>
                  <td>${escapeHtml(member.notes || "-")}</td>
                  <td class="table-actions">
                    ${actions}
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
    showToast("Brak przypisanego koła. Nie można zapisać członka.");
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
    showToast("Podaj imię i nazwisko członka.");
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
      showToast("Nie udało się zaktualizować członka.");
      return;
    }
  } else {
    const { error } = await appState.supabase.from("members").insert([payload]);

    if (error) {
      console.error(error);
      showToast("Nie udało się dodać członka.");
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
    showToast("Nie udało się zmienić statusu członka.");
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
    showToast("Brak przypisanego koła. Nie można dodać danych testowych.");
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
      showToast("Nie udało się dodać danych testowych członków.");
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
    showToast("Nie udało się sprawdzić istniejących danych testowych składek.");
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
      showToast("Nie udało się dodać danych testowych składek.");
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
  showToast("Dane testowe zostały dodane lub już istnieją.");
}

async function clearTestData() {
  const circleId = getActiveCircleId();
  if (!circleId) {
    showToast("Brak przypisanego koła. Nie można usunąć danych testowych.");
    return;
  }

  const { data: contributions, error: contributionsError } = await appState.supabase
    .from("contributions")
    .select("id, status")
    .eq("circle_id", circleId)
    .eq("notes", "TEST_DATA");

  if (contributionsError) {
    console.error(contributionsError);
    showToast("Nie udało się pobrać danych testowych składek.");
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
    showToast("Nie udało się usunąć danych testowych składek.");
    return;
  }

  const { error: deleteMembersError } = await appState.supabase
    .from("members")
    .delete()
    .eq("circle_id", circleId)
    .eq("notes", "TEST_DATA");

  if (deleteMembersError) {
    console.error(deleteMembersError);
    showToast("Nie udało się usunąć danych testowych członków.");
    return;
  }

  await loadMembers();
  await loadContributions();
  await loadDashboardStats();
  await refreshFinanceBalance();
  showToast("Dane testowe zostały usunięte.");
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

function getVisibleFinances() {
  const searchTerm = appState.financeSearchTerm;
  const typeFilter = appState.financeFilterType;
  const statusFilter = appState.financeFilterStatus;
  const yearFilter = appState.financeFilterYear;

  return (appState.finances || []).filter((entry) => {
    if (typeFilter !== "all" && entry.type !== typeFilter) return false;
    if (statusFilter !== "all" && entry.status !== statusFilter) return false;
    if (yearFilter !== "all" && String(entry.entry_date || "").substring(0, 4) !== yearFilter) return false;

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
}

function renderFinanceList() {
  const listEl = document.getElementById("financesList");
  if (!listEl) return;

  const visibleFinances = getVisibleFinances();

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
              const canEdit = canWriteData() && isManualEntry;
              const canCancel = canWriteData() && entry.status === "active" && isManualEntry;

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
              if (!canWriteData() && isManualEntry) {
                editButton = `<span class="muted">Podgląd</span>`;
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
    showToast("Brak przypisanego koła. Nie można zapisać wpisu finansowego.");
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
    showToast("Uzupełnij wszystkie wymagane pola.");
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
      showToast("Nie udało się zaktualizować wpisu finansowego.");
      return;
    }
  } else {
    const { error } = await appState.supabase.from("finance_entries").insert([payload]);

    if (error) {
      console.error(error);
      showToast("Nie udało się dodać wpisu finansowego.");
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
    showToast("Nie udało się anulować wpisu finansowego.");
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
    showToast("Nie udało się pobrać potraw.");
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

            const eventActions = canWriteData()
              ? `<button type="button" onclick="window.handleSelectCulinaryEvent('${event.id}')">Potrawy</button>
                 <button type="button" onclick="window.handleEditCulinaryEvent('${event.id}')">Edytuj</button>
                 <button type="button" onclick="window.handlePrintCulinaryEvent('${event.id}')" class="secondary">Drukuj</button>
                 <button type="button" onclick="window.handleDeleteCulinaryEvent('${event.id}')" class="secondary">Usuń</button>`
              : `<button type="button" onclick="window.handleSelectCulinaryEvent('${event.id}')">Potrawy</button>
                 <button type="button" onclick="window.handlePrintCulinaryEvent('${event.id}')" class="secondary">Drukuj</button>`;

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
                    ${eventActions}
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
            const dishActions = canWriteData()
              ? `<button type="button" onclick="window.handleShowCulinaryDishDetails('${dish.id}')">Szczegóły</button>
                 <button type="button" onclick="window.handleEditCulinaryDish('${dish.id}')">Edytuj</button>
                 <button type="button" onclick="window.handleDeleteCulinaryDish('${dish.id}')" class="secondary">Usuń</button>`
              : `<button type="button" onclick="window.handleShowCulinaryDishDetails('${dish.id}')">Szczegóły</button>`;
            return `
              <tr class="${selectedClass}">
                <td><span class="member-name">${escapeHtml(dish.name || "Bez nazwy")}</span></td>
                <td>${escapeHtml(dish.prepared_by || "-")}</td>
                <td><span class="table-clamp clamp-2">${escapeHtml(dish.ingredients || "-")}</span></td>
                <td><span class="table-clamp clamp-3">${escapeHtml(dish.description || "-")}</span></td>
                <td><span class="table-clamp clamp-1">${escapeHtml(dish.notes || "-")}</span></td>
                <td class="table-actions">
                  <span class="actions-wrap">
                    ${dishActions}
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
    showToast("Brak przypisanego koła. Nie można zapisać wydarzenia.");
    return;
  }

  const title = document.getElementById("culinaryEventTitle").value.trim();
  if (!title) {
    showToast("Podaj nazwę wydarzenia.");
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
      showToast("Nie udało się zaktualizować wydarzenia.");
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
      showToast("Nie udało się dodać wydarzenia.");
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
    showToast("Nie udało się usunąć wydarzenia.");
    return;
  }

  if (appState.selectedCulinaryEventId === eventId) {
    appState.selectedCulinaryEventId = null;
  }

  await loadCulinaryEvents();
}

function showCulinaryDishForm(dishEntry = null) {
  if (!appState.selectedCulinaryEventId) {
    showToast("Najpierw wybierz wydarzenie.");
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
    showToast("Brak wybranego wydarzenia. Nie można zapisać potrawy.");
    return;
  }

  const name = document.getElementById("culinaryDishName").value.trim();
  if (!name) {
    showToast("Podaj nazwę potrawy.");
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
      showToast("Nie udało się zaktualizować potrawy.");
      return;
    }
  } else {
    const { error } = await appState.supabase
      .from("culinary_dishes")
      .insert([payload]);

    if (error) {
      console.error(error);
      showToast("Nie udało się dodać potrawy.");
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
    showToast("Nie udało się usunąć potrawy.");
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



function getCircleStorageLimitMb(circle = getActiveCircle()) {
  const value = Number(circle?.storage_limit_mb);
  return Number.isFinite(value) && value > 0 ? value : 50;
}

function getDocumentFilePath(doc) {
  return doc?.file_path || doc?.file_url || "";
}

function getDocumentFileName(doc) {
  if (doc?.file_name) return doc.file_name;
  const path = getDocumentFilePath(doc);
  if (!path) return "";
  try {
    return decodeURIComponent(String(path).split("/").pop() || "plik");
  } catch {
    return String(path).split("/").pop() || "plik";
  }
}

function getDocumentFileSizeBytes(doc) {
  const value = Number(doc?.file_size_bytes || 0);
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function getCurrentDocumentStorageUsageBytes() {
  return (appState.documents || []).reduce((sum, doc) => sum + getDocumentFileSizeBytes(doc), 0);
}

function getCircleStorageUsageBytes(circleId) {
  const rows = appState.allDocumentStorageRows || [];
  return rows
    .filter((doc) => doc.circle_id === circleId)
    .reduce((sum, doc) => sum + getDocumentFileSizeBytes(doc), 0);
}

function formatBytes(bytes) {
  const value = Number(bytes || 0);
  if (value < 1024) return `${value} B`;
  const kb = value / 1024;
  if (kb < 1024) return `${kb.toFixed(1).replace(".", ",")} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1).replace(".", ",")} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2).replace(".", ",")} GB`;
}

function storageStatusClass(percent) {
  if (percent >= 90) return "storage-danger";
  if (percent >= 70) return "storage-warning";
  return "storage-ok";
}

function renderDocumentStorageUsage() {
  const circle = getActiveCircle();
  const limitMb = getCircleStorageLimitMb(circle);
  const limitBytes = limitMb * 1024 * 1024;
  const usedBytes = getCurrentDocumentStorageUsageBytes();
  const percent = limitBytes > 0 ? Math.min(100, Math.round((usedBytes / limitBytes) * 100)) : 0;

  setText("documentStorageTitle", `${formatBytes(usedBytes)} / ${limitMb} MB`);
  setText("documentStoragePercent", `${percent}%`);

  const hint = document.getElementById("documentStorageHint");
  if (hint) {
    if (percent >= 100) {
      hint.textContent = "Limit miejsca został wykorzystany. Usuń niepotrzebne pliki albo skontaktuj się z administratorem.";
    } else if (percent >= 90) {
      hint.textContent = "Uwaga: zbliżasz się do końca dostępnego miejsca na dokumenty.";
    } else if (percent >= 70) {
      hint.textContent = "Miejsce na dokumenty jest już w dużej części wykorzystane.";
    } else {
      hint.textContent = "Limit dotyczy plików dodanych w Dokumentach.";
    }
  }

  const bar = document.getElementById("documentStorageBar");
  if (bar) {
    bar.style.width = `${percent}%`;
    bar.classList.remove("storage-ok", "storage-warning", "storage-danger");
    bar.classList.add(storageStatusClass(percent));
  }

  const card = document.getElementById("documentStorageCard");
  if (card) {
    card.classList.remove("storage-ok-card", "storage-warning-card", "storage-danger-card");
    card.classList.add(`${storageStatusClass(percent)}-card`);
  }
}

async function loadStorageUsageForSuperAdmin() {
  if (!isSuperAdmin()) {
    appState.allDocumentStorageRows = [];
    appState.storageUsageByCircle = {};
    return;
  }

  const { data, error } = await appState.supabase
    .from("documents")
    .select("circle_id, file_size_bytes, file_url, file_path");

  if (error) {
    console.error(error);
    appState.allDocumentStorageRows = [];
    appState.storageUsageByCircle = {};
    return;
  }

  appState.allDocumentStorageRows = data || [];
  appState.storageUsageByCircle = {};

  (data || []).forEach((doc) => {
    const circleId = doc.circle_id;
    if (!circleId) return;
    appState.storageUsageByCircle[circleId] = (appState.storageUsageByCircle[circleId] || 0) + getDocumentFileSizeBytes(doc);
  });
}

function renderStorageLimitsList() {
  const list = document.getElementById("circleStorageList");
  if (!list) return;

  if (!isSuperAdmin()) {
    list.innerHTML = "";
    return;
  }

  if (!appState.availableCircles.length) {
    list.innerHTML = `<tr><td colspan="6">Brak kół w programie.</td></tr>`;
    return;
  }

  list.innerHTML = appState.availableCircles.map((circle) => {
    const usedBytes = appState.storageUsageByCircle[circle.id] || 0;
    const limitMb = getCircleStorageLimitMb(circle);
    const limitBytes = limitMb * 1024 * 1024;
    const percent = limitBytes > 0 ? Math.round((usedBytes / limitBytes) * 100) : 0;
    const statusClass = storageStatusClass(percent);
    const statusLabel = percent >= 100 ? "Limit przekroczony" : (percent >= 90 ? "Prawie pełne" : (percent >= 70 ? "Uwaga" : "OK"));

    return `
      <tr>
        <td>
          <div class="circle-table-name">
            <span class="circle-table-logo">${circleLogoHtml(circle)}</span>
            <span>
              <span class="member-name">${escapeHtml(circle.name)}</span>
              ${circle.short_name ? `<span class="table-note">${escapeHtml(circle.short_name)}</span>` : ""}
            </span>
          </div>
        </td>
        <td>${formatBytes(usedBytes)}</td>
        <td>${limitMb} MB</td>
        <td>
          <div class="mini-storage">
            <span>${percent}%</span>
            <div class="mini-storage-bar"><div class="${statusClass}" style="width:${Math.min(100, percent)}%"></div></div>
          </div>
        </td>
        <td><span class="status-pill ${statusClass}">${statusLabel}</span></td>
        <td class="table-actions">
          <button type="button" onclick="showCircleForm('${circle.id}')">Zmień limit</button>
          <button type="button" class="secondary" onclick="switchToCircle('${circle.id}')">Przełącz</button>
        </td>
      </tr>
    `;
  }).join("");
}

function canUploadDocumentFile(fileSizeBytes, replacingDocumentId = null) {
  const circle = getActiveCircle();
  const limitBytes = getCircleStorageLimitMb(circle) * 1024 * 1024;
  let usedBytes = getCurrentDocumentStorageUsageBytes();

  if (replacingDocumentId) {
    const existingDoc = appState.documents.find((doc) => doc.id === replacingDocumentId);
    usedBytes -= getDocumentFileSizeBytes(existingDoc);
  }

  return {
    allowed: usedBytes + Number(fileSizeBytes || 0) <= limitBytes,
    usedBytes: Math.max(0, usedBytes),
    limitBytes,
    afterBytes: usedBytes + Number(fileSizeBytes || 0)
  };
}


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
  renderDocumentStorageUsage();
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
  const withFiles = documents.filter((doc) => Boolean(getDocumentFilePath(doc))).length;

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
      getDocumentFilePath(doc),
      doc.file_name,
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
              const filePath = getDocumentFilePath(doc);
              const hasFile = Boolean(filePath);
              const fileName = getDocumentFileName(doc);
              const fileSize = getDocumentFileSizeBytes(doc);
              const linkCell = hasFile
                ? `<button type="button" onclick="window.handleOpenDocumentFile('${doc.id}')">Otwórz</button>
                   <span class="table-note">${escapeHtml(fileName)}${fileSize ? ` • ${formatBytes(fileSize)}` : ""}</span>`
                : (canWriteData() ? `<button type="button" onclick="window.handleAddDocumentFile('${doc.id}')" class="secondary">Dodaj</button>` : `<span class="muted">Brak pliku</span>`);
              const documentActions = canWriteData()
                ? `<button type="button" onclick="window.handleEditDocument('${doc.id}')">Edytuj</button>
                   <button type="button" onclick="window.handleDeleteDocument('${doc.id}')" class="secondary">Usuń</button>`
                : `<span class="muted">Podgląd</span>`;

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
                      ${documentActions}
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
  const pathInput = document.getElementById("documentFileUrl");
  const nameInput = document.getElementById("documentFileName");
  const sizeInput = document.getElementById("documentFileSize");
  const addBtn = document.getElementById("showDocumentLinkBtn");
  const openBtn = document.getElementById("openDocumentLinkBtn");
  const status = document.getElementById("documentAttachmentStatus");
  const filePath = pathInput?.value?.trim() || "";
  const fileName = nameInput?.value?.trim() || (filePath ? filePath.split("/").pop() : "");
  const fileSize = Number(sizeInput?.value || 0);

  if (status) {
    status.textContent = filePath
      ? `Plik dodany${fileName ? `: ${fileName}` : ""}${fileSize ? ` (${formatBytes(fileSize)})` : ""}`
      : "Brak pliku";
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
    showToast("Brak przypisanego koła. Nie można dodać pliku.", "error");
    return;
  }

  const targetDocumentId = appState.documentUploadTargetId || appState.editingDocument || null;
  const limitCheck = canUploadDocumentFile(file.size, targetDocumentId);

  if (!limitCheck.allowed) {
    showToast(
      `Limit miejsca na dokumenty został przekroczony. Po dodaniu byłoby ${formatBytes(limitCheck.afterBytes)} z ${formatBytes(limitCheck.limitBytes)}.`,
      "error"
    );
    event.target.value = "";
    updateDocumentAttachmentUi();
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
    showToast("Nie udało się wgrać pliku. Sprawdź bucket documents i polityki dostępu.", "error");
    updateDocumentAttachmentUi();
    return;
  }

  const filePayload = {
    file_url: storagePath,
    file_path: storagePath,
    file_name: file.name,
    file_size_bytes: file.size,
    file_mime_type: file.type || null
  };

  if (appState.documentUploadTargetId) {
    const existingDoc = appState.documents.find((doc) => doc.id === appState.documentUploadTargetId);
    const oldPath = getDocumentFilePath(existingDoc);

    const { error: updateError } = await appState.supabase
      .from("documents")
      .update(filePayload)
      .eq("id", appState.documentUploadTargetId);

    if (updateError) {
      console.error(updateError);
      showToast("Plik został wgrany, ale nie udało się przypisać go do dokumentu.", "error");
      appState.documentUploadTargetId = null;
      return;
    }

    if (oldPath && oldPath !== storagePath && !/^https?:\/\//i.test(oldPath)) {
      await appState.supabase.storage.from("documents").remove([oldPath]);
    }

    appState.documentUploadTargetId = null;
    await loadDocuments();
    await loadDashboardStats();
    await loadStorageUsageForSuperAdmin();
    renderStorageLimitsList();
    showToast("Plik został dodany do dokumentu.");
    return;
  }

  setInputValue("documentFileUrl", storagePath);
  setInputValue("documentFileName", file.name);
  setInputValue("documentFileSize", String(file.size));
  setInputValue("documentFileMimeType", file.type || "");

  updateDocumentAttachmentUi();
  showToast("Plik został wgrany. Kliknij Zapisz, aby przypisać go do dokumentu.");
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
    showToast("Nie udało się otworzyć pliku. Sprawdź dostęp do Supabase Storage.");
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
  document.getElementById("documentFileUrl").value = getDocumentFilePath(documentEntry) || "";
  document.getElementById("documentFileName").value = getDocumentFileName(documentEntry) || "";
  document.getElementById("documentFileSize").value = getDocumentFileSizeBytes(documentEntry) || "";
  document.getElementById("documentFileMimeType").value = documentEntry?.file_mime_type || "";
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
    showToast("Brak przypisanego koła. Nie można zapisać dokumentu.");
    return;
  }

  const documentDate = document.getElementById("documentDate").value || null;
  const documentType = document.getElementById("documentType").value || "Inne";
  const title = document.getElementById("documentTitle").value.trim();
  const description = document.getElementById("documentDescription").value.trim();
  const fileUrl = document.getElementById("documentFileUrl").value.trim();
  const fileName = document.getElementById("documentFileName").value.trim();
  const fileSizeBytes = Number(document.getElementById("documentFileSize").value || 0);
  const fileMimeType = document.getElementById("documentFileMimeType").value.trim();
  const notes = document.getElementById("documentNotes").value.trim();

  if (!title) {
    showToast("Podaj tytuł dokumentu.");
    return;
  }

  const payload = {
    circle_id: circleId,
    document_date: documentDate,
    title,
    document_type: documentType,
    description: description || null,
    file_url: fileUrl || null,
    file_path: fileUrl || null,
    file_name: fileName || null,
    file_size_bytes: fileSizeBytes || null,
    file_mime_type: fileMimeType || null,
    notes: notes || null
  };

  if (appState.editingDocument) {
    const { error } = await appState.supabase
      .from("documents")
      .update(payload)
      .eq("id", appState.editingDocument);

    if (error) {
      console.error(error);
      showToast("Nie udało się zaktualizować dokumentu.");
      return;
    }
  } else {
    const { error } = await appState.supabase.from("documents").insert([payload]);

    if (error) {
      console.error(error);
      showToast("Nie udało się dodać dokumentu.");
      return;
    }
  }

  hideDocumentForm();
  await loadDocuments();
  await loadDashboardStats();
  await loadStorageUsageForSuperAdmin();
  renderStorageLimitsList();
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
  const filePath = getDocumentFilePath(documentEntry);
  if (!filePath) return;
  await openDocumentFilePath(filePath);
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
    showToast("Nie udało się usunąć dokumentu.");
    return;
  }

  const filePath = getDocumentFilePath(documentEntry);
  if (filePath && !/^https?:\/\//i.test(filePath)) {
    const { error: storageError } = await appState.supabase
      .storage
      .from("documents")
      .remove([filePath]);

    if (storageError) {
      console.warn("Nie udało się usunąć pliku z Storage:", storageError);
    }
  }

  await loadDocuments();
  await loadDashboardStats();
  await loadStorageUsageForSuperAdmin();
  renderStorageLimitsList();
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
    showToast("Brak aktywnego koła do edycji.");
    return;
  }

  setInputValue("circleNameInput", circle.name || "");
  setInputValue("circleShortNameInput", circle.short_name || "");
  setInputValue("circleStatusInput", circle.status || "active");
  setInputValue("circleFeeInput", circle.membership_fee_amount ?? 0);
  setInputValue("circleEmailInput", circle.contact_email || "");
  setInputValue("circlePhoneInput", circle.contact_phone || "");
  setInputValue("circleNotesInput", circle.notes || "");
  renderLogoPreview("activeCircleLogoPreview", circle?.logo_url, circle?.short_name || circle?.name || "KGW");

  document.getElementById("activeCircleFormBox")?.classList.remove("hidden");
}

function hideActiveCircleForm() {
  document.getElementById("activeCircleFormBox")?.classList.add("hidden");
}

async function handleActiveCircleFormSubmit(event) {
  event.preventDefault();

  const circleId = getActiveCircleId();
  if (!circleId) {
    showToast("Brak aktywnego koła.");
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
    showToast("Nazwa koła jest wymagana.");
    return;
  }

  const { error } = await appState.supabase
    .from("circles")
    .update(payload)
    .eq("id", circleId);

  if (error) {
    console.error(error);
    showToast("Nie udało się zapisać danych koła. Sprawdź uprawnienia.");
    return;
  }

  hideActiveCircleForm();
  await loadAvailableCircles();
  appState.circle = getActiveCircle();
  renderUserInfo();
  renderSuperAdminUi();
  setDefaultContributionGeneratorValues();
  showToast("Dane koła zostały zapisane.");
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
  setInputValue("managedCircleStorageLimitInput", getCircleStorageLimitMb(circle || { storage_limit_mb: 50 }));
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
    showToast("Tylko Super Admin może zarządzać kołami.");
    return;
  }

  const circleId = document.getElementById("circleIdInput")?.value || "";
  const payload = {
    name: document.getElementById("managedCircleNameInput")?.value.trim(),
    short_name: document.getElementById("managedCircleShortNameInput")?.value.trim() || null,
    status: document.getElementById("managedCircleStatusInput")?.value || "active",
    membership_fee_amount: Number(document.getElementById("managedCircleFeeInput")?.value || 0),
    storage_limit_mb: Number(document.getElementById("managedCircleStorageLimitInput")?.value || 50),
    contact_email: document.getElementById("managedCircleEmailInput")?.value.trim() || null,
    contact_phone: document.getElementById("managedCirclePhoneInput")?.value.trim() || null,
    notes: document.getElementById("managedCircleNotesInput")?.value.trim() || null
  };

  if (!payload.name) {
    showToast("Nazwa koła jest wymagana.");
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
    showToast("Nie udało się zapisać koła.");
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
  showToast("Koło zostało zapisane.");
}


// =========================================================
// UŻYTKOWNICY KOŁA / MIEJSCA DOSTĘPU
// =========================================================

async function loadCircleUsers() {
  const list = document.getElementById("circleUsersList");
  const countLabel = document.getElementById("circleUsersCountLabel");

  if (!list) return;

  if (!canManageUsers()) {
    appState.circleUsers = [];
    appState.circleUserSlots = [];
    list.innerHTML = "";
    if (countLabel) setText("circleUsersCountLabel", "0 / 0 aktywnych miejsc");
    return;
  }

  const circleId = getActiveCircleId();
  if (!circleId) {
    appState.circleUsers = [];
    appState.circleUserSlots = [];
    list.innerHTML = `<tr><td colspan="5">Brak aktywnego koła.</td></tr>`;
    if (countLabel) setText("circleUsersCountLabel", "0 / 0 aktywnych miejsc");
    return;
  }

  const { data: profiles, error: profilesError } = await appState.supabase
    .from("profiles")
    .select("user_id, circle_id, display_name, email, role, is_active, created_at, updated_at")
    .eq("circle_id", circleId)
    .order("display_name", { ascending: true });

  if (profilesError) {
    console.error(profilesError);
    showToast("Nie udało się pobrać użytkowników koła.", "error");
    appState.circleUsers = [];
    appState.circleUserSlots = [];
    renderCircleUsersList();
    return;
  }

  appState.circleUsers = (profiles || []).filter((profile) => profile.role !== "super_admin");

  const { data: slots, error: slotsError } = await appState.supabase
    .from("circle_user_slots")
    .select("id, circle_id, slot_name, default_role, assigned_user_id, assigned_email, assigned_display_name, status, notes, created_at, updated_at")
    .eq("circle_id", circleId)
    .order("created_at", { ascending: true });

  if (slotsError) {
    console.error(slotsError);
    showToast("Nie udało się pobrać miejsc użytkowników koła. Sprawdź, czy wykonano SQL dla circle_user_slots.", "error");
    appState.circleUserSlots = [];
  } else {
    appState.circleUserSlots = slots || [];
  }

  renderCircleUsersList();
}

function renderCircleUsersList() {
  const list = document.getElementById("circleUsersList");
  const countLabel = document.getElementById("circleUsersCountLabel");

  if (!list) return;

  if (!canManageUsers()) {
    list.innerHTML = "";
    return;
  }

  const slots = appState.circleUserSlots || [];
  const profiles = appState.circleUsers || [];
  const profileById = new Map(profiles.map((profile) => [profile.user_id, profile]));
  const profileByEmail = new Map(profiles.filter((profile) => profile.email).map((profile) => [String(profile.email).toLowerCase(), profile]));
  const activeSlots = slots.filter((slot) => slot.status === "active").length;

  if (countLabel) {
    setText("circleUsersCountLabel", `${activeSlots} / ${slots.length || profiles.length} aktywnych miejsc`);
  }

  if (!slots.length) {
    if (!profiles.length) {
      list.innerHTML = `<tr><td colspan="5">Brak miejsc użytkowników. Dodaj miejsca w bazie lub odśwież dane.</td></tr>`;
      return;
    }

    list.innerHTML = profiles.map((profile) => renderCircleUserProfileRow(profile)).join("");
    return;
  }

  list.innerHTML = slots.map((slot) => {
    const profile = slot.assigned_user_id
      ? profileById.get(slot.assigned_user_id)
      : (slot.assigned_email ? profileByEmail.get(String(slot.assigned_email).toLowerCase()) : null);
    return renderCircleUserSlotRow(slot, profile);
  }).join("");
}

function renderCircleUserProfileRow(profile) {
  const statusClass = profile.is_active ? "status-active" : "status-cancelled";
  const statusLabel = profile.is_active ? "Aktywny" : "Zablokowany";
  const role = roleLabel(profile.role);

  return `
    <tr>
      <td>
        <span class="member-name">${escapeHtml(profile.display_name || "Użytkownik")}</span>
        <span class="table-note">Profil przypisany do koła</span>
      </td>
      <td>${escapeHtml(profile.email || "-")}</td>
      <td><span class="status-pill role-pill">${escapeHtml(role)}</span></td>
      <td><span class="status-pill ${statusClass}">${statusLabel}</span></td>
      <td class="table-actions">
        <button type="button" onclick="window.handleEditCircleUser('${profile.user_id}')">Edytuj</button>
        <button type="button" onclick="window.handleToggleCircleUser('${profile.user_id}')" class="secondary">${profile.is_active ? "Zablokuj" : "Aktywuj"}</button>
      </td>
    </tr>`;
}

function renderCircleUserSlotRow(slot, profile) {
  const status = slot.status || "available";
  const isAvailable = status === "available";
  const isActive = status === "active";
  const isInvited = status === "invited";
  const isInactive = status === "inactive";
  const displayName = profile?.display_name || slot.assigned_display_name || (isAvailable ? "Wolne miejsce" : "Użytkownik");
  const email = profile?.email || slot.assigned_email || "-";
  const role = roleLabel(profile?.role || slot.default_role);
  const statusLabel = isAvailable ? "Do aktywacji" : isInvited ? "Zgłoszono" : isInactive ? "Nieaktywny" : "Aktywny";
  const statusClass = isAvailable ? "status-due" : isInvited ? "status-exempt" : isInactive ? "status-cancelled" : "status-active";

  let actions = "";
  if (isAvailable) {
    actions = `<button type="button" onclick="window.handleActivateCircleUserSlot('${slot.id}')">Aktywuj</button>`;
  } else if (isInvited) {
    actions = `
      <button type="button" onclick="window.showActivationRequestForSlot('${slot.id}')">Zgłoszenie</button>
      <button type="button" onclick="window.cancelActivationRequestForSlot('${slot.id}')" class="secondary">Anuluj</button>`;
  } else {
    actions = `
      <button type="button" onclick="window.handleEditCircleUserSlot('${slot.id}')">Edytuj</button>
      <button type="button" onclick="window.handleDeactivateCircleUserSlot('${slot.id}')" class="secondary">${isActive ? "Wyłącz miejsce" : "Przywróć"}</button>`;
  }

  return `
    <tr>
      <td>
        <span class="member-name">${escapeHtml(slot.slot_name || "Miejsce użytkownika")}</span>
        ${slot.notes ? `<span class="table-note">${escapeHtml(slot.notes)}</span>` : ""}
      </td>
      <td>
        <span class="member-name small-name">${escapeHtml(displayName)}</span>
        <span class="table-note">${escapeHtml(email)}</span>
      </td>
      <td><span class="status-pill role-pill">${escapeHtml(role)}</span></td>
      <td><span class="status-pill ${statusClass}">${statusLabel}</span></td>
      <td class="table-actions">${actions}</td>
    </tr>`;
}

function showExtraUserSlotForm() {
  if (!isSuperAdmin()) {
    showToast("Dodatkowe miejsca może tworzyć administrator programu.", "error");
    return;
  }
  showCircleUserSlotForm(null, true);
}

function handleActivateCircleUserSlot(slotId) {
  showActivationRequestForm(slotId);
}

function handleEditCircleUserSlot(slotId) {
  showToast("Edycja aktywnego miejsca zostanie rozwinięta w kolejnej wersji. Na razie użyj Super Admina/Supabase w razie potrzeby.", "info");
}

function showCircleUserSlotForm(slotId = null, createNew = false) {
  if (!canManageUsers()) {
    showToast("Brak uprawnień do zarządzania użytkownikami.", "error");
    return;
  }

  const slot = slotId ? appState.circleUserSlots.find((item) => item.id === slotId) : null;
  appState.editingCircleUserSlot = slot || (createNew ? { createNew: true } : null);

  const formBox = document.getElementById("circleUserFormBox");
  const title = document.getElementById("circleUserFormTitle");
  const uidInput = document.getElementById("circleUserUidInput");

  setInputValue("circleUserSlotIdInput", slot?.id || "");
  setInputValue("circleUserSlotNameInput", slot?.slot_name || (createNew ? "Użytkownik" : ""));
  setInputValue("circleUserIdInput", slot?.assigned_user_id || "");
  setInputValue("circleUserUidInput", slot?.assigned_user_id || "");
  setInputValue("circleUserDisplayNameInput", slot?.assigned_display_name || "");
  setInputValue("circleUserEmailInput", slot?.assigned_email || "");
  setInputValue("circleUserRoleInput", slot?.default_role || "staff");
  setInputValue("circleUserActiveInput", slot?.status === "active" ? "active" : slot?.status === "inactive" ? "inactive" : slot?.status === "invited" ? "invited" : "available");

  if (uidInput) uidInput.disabled = false;
  if (title) title.textContent = createNew ? "Dodaj miejsce użytkownika" : (slot?.status === "available" ? "Aktywuj użytkownika" : "Edytuj miejsce użytkownika");

  formBox?.classList.remove("hidden");
  document.getElementById("circleUserDisplayNameInput")?.focus();
}

function showCircleUserForm(userId = null) {
  const profile = userId ? appState.circleUsers.find((item) => item.user_id === userId) : null;
  if (!profile) {
    showCircleUserSlotForm(null, true);
    return;
  }

  const pseudoSlot = {
    id: null,
    slot_name: "Użytkownik koła",
    default_role: profile.role,
    assigned_user_id: profile.user_id,
    assigned_email: profile.email,
    assigned_display_name: profile.display_name,
    status: profile.is_active ? "active" : "inactive"
  };

  appState.editingCircleUserSlot = pseudoSlot;
  const formBox = document.getElementById("circleUserFormBox");
  const title = document.getElementById("circleUserFormTitle");
  setInputValue("circleUserSlotIdInput", "");
  setInputValue("circleUserSlotNameInput", pseudoSlot.slot_name);
  setInputValue("circleUserIdInput", profile.user_id || "");
  setInputValue("circleUserUidInput", profile.user_id || "");
  setInputValue("circleUserDisplayNameInput", profile.display_name || "");
  setInputValue("circleUserEmailInput", profile.email || "");
  setInputValue("circleUserRoleInput", profile.role || "staff");
  setInputValue("circleUserActiveInput", profile.is_active ? "active" : "inactive");
  if (title) title.textContent = "Edytuj użytkownika koła";
  formBox?.classList.remove("hidden");
}

function hideCircleUserForm() {
  appState.editingCircleUserSlot = null;
  document.getElementById("circleUserFormBox")?.classList.add("hidden");
  setInputValue("circleUserSlotIdInput", "");
  setInputValue("circleUserSlotNameInput", "");
  setInputValue("circleUserIdInput", "");
  setInputValue("circleUserUidInput", "");
  setInputValue("circleUserDisplayNameInput", "");
  setInputValue("circleUserEmailInput", "");
  setInputValue("circleUserRoleInput", "staff");
  setInputValue("circleUserActiveInput", "available");
}

async function handleCircleUserFormSubmit(event) {
  event.preventDefault();

  if (!canManageUsers()) {
    showToast("Brak uprawnień do zarządzania użytkownikami.", "error");
    return;
  }

  const circleId = getActiveCircleId();
  if (!circleId) {
    showToast("Brak aktywnego koła.", "error");
    return;
  }

  const slotId = document.getElementById("circleUserSlotIdInput")?.value.trim();
  const slotName = document.getElementById("circleUserSlotNameInput")?.value.trim() || "Użytkownik";
  const userId = document.getElementById("circleUserUidInput")?.value.trim();
  const displayName = document.getElementById("circleUserDisplayNameInput")?.value.trim();
  const email = document.getElementById("circleUserEmailInput")?.value.trim();
  const role = document.getElementById("circleUserRoleInput")?.value;
  const status = document.getElementById("circleUserActiveInput")?.value || "available";

  if (!slotName) {
    showToast("Nazwa miejsca jest wymagana.", "error");
    return;
  }

  if (!["circle_admin", "staff", "accountant_readonly"].includes(role)) {
    showToast("Nieprawidłowa rola użytkownika.", "error");
    return;
  }

  if (status === "active" && (!userId || !displayName)) {
    showToast("Do aktywacji potrzebny jest UID konta oraz nazwa użytkownika. Docelowo zastąpimy to zaproszeniem e-mail.", "error");
    return;
  }

  if (userId) {
    const payload = {
      user_id: userId,
      circle_id: circleId,
      display_name: displayName || email || slotName,
      email: email || null,
      role,
      is_active: status === "active"
    };

    const { error: profileError } = await appState.supabase
      .from("profiles")
      .upsert(payload, { onConflict: "user_id" });

    if (profileError) {
      console.error(profileError);
      showToast("Nie udało się zapisać profilu użytkownika. Sprawdź UID i uprawnienia.", "error");
      return;
    }
  }

  const slotPayload = {
    circle_id: circleId,
    slot_name: slotName,
    default_role: role,
    assigned_user_id: userId || null,
    assigned_email: email || null,
    assigned_display_name: displayName || null,
    status,
    notes: status === "available" ? "Wolne miejsce do aktywacji przez administratora koła." : null
  };

  let result;
  if (slotId) {
    result = await appState.supabase
      .from("circle_user_slots")
      .update({ ...slotPayload, updated_at: new Date().toISOString() })
      .eq("id", slotId)
      .eq("circle_id", circleId);
  } else {
    result = await appState.supabase
      .from("circle_user_slots")
      .insert(slotPayload);
  }

  if (result.error) {
    console.error(result.error);
    showToast("Nie udało się zapisać miejsca użytkownika.", "error");
    return;
  }

  hideCircleUserForm();
  await loadCircleUsers();
  showToast("Miejsce użytkownika zostało zapisane.");
}

function handleEditCircleUser(userId) {
  showCircleUserForm(userId);
}

async function handleToggleCircleUser(userId) {
  const user = appState.circleUsers.find((item) => item.user_id === userId);
  if (!user) return;

  if (user.role === "super_admin") {
    showToast("Nie można zablokować administratora programu z tego miejsca.", "error");
    return;
  }

  const { error } = await appState.supabase
    .from("profiles")
    .update({ is_active: !user.is_active, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("circle_id", getActiveCircleId());

  if (error) {
    console.error(error);
    showToast("Nie udało się zmienić statusu użytkownika.", "error");
    return;
  }

  await loadCircleUsers();
  showToast(user.is_active ? "Użytkownik został zablokowany." : "Użytkownik został aktywowany.");
}

async function handleDeactivateCircleUserSlot(slotId) {
  const slot = appState.circleUserSlots.find((item) => item.id === slotId);
  if (!slot) return;

  const nextStatus = slot.status === "active" ? "inactive" : "active";
  const { error } = await appState.supabase
    .from("circle_user_slots")
    .update({ status: nextStatus, updated_at: new Date().toISOString() })
    .eq("id", slotId)
    .eq("circle_id", getActiveCircleId());

  if (error) {
    console.error(error);
    showToast("Nie udało się zmienić statusu miejsca użytkownika.", "error");
    return;
  }

  if (slot.assigned_user_id) {
    await appState.supabase
      .from("profiles")
      .update({ is_active: nextStatus === "active", updated_at: new Date().toISOString() })
      .eq("user_id", slot.assigned_user_id)
      .eq("circle_id", getActiveCircleId());
  }

  await loadCircleUsers();
  showToast(nextStatus === "active" ? "Miejsce zostało przywrócone." : "Miejsce zostało wyłączone.");
}


// =========================================================
// ZGŁOSZENIA AKTYWACJI UŻYTKOWNIKÓW
// =========================================================

async function loadActivationRequests() {
  const list = document.getElementById("activationRequestsList");

  if (!isSuperAdmin() && !canManageUsers()) {
    appState.userActivationRequests = [];
    renderActivationRequestsList();
    return;
  }

  let query = appState.supabase
    .from("user_activation_requests")
    .select("id, circle_id, slot_id, requested_display_name, requested_email, requested_phone, requested_role, request_notes, status, admin_notes, created_at, reviewed_at")
    .order("created_at", { ascending: false });

  if (!isSuperAdmin()) {
    const circleId = getActiveCircleId();
    if (!circleId) {
      appState.userActivationRequests = [];
      renderActivationRequestsList();
      return;
    }
    query = query.eq("circle_id", circleId);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    appState.userActivationRequests = [];
    renderActivationRequestsList();
    if (list || canManageUsers()) {
      showToast("Nie udało się pobrać zgłoszeń użytkowników. Sprawdź, czy wykonano SQL dla user_activation_requests.", "error");
    }
    return;
  }

  appState.userActivationRequests = data || [];
  renderActivationRequestsList();
}

function renderActivationRequestsList() {
  const list = document.getElementById("activationRequestsList");
  if (!list) return;

  if (!isSuperAdmin()) {
    list.innerHTML = "";
    return;
  }

  const requests = appState.userActivationRequests || [];

  if (!requests.length) {
    list.innerHTML = `<tr><td colspan="8">Brak zgłoszeń użytkowników.</td></tr>`;
    return;
  }

  list.innerHTML = requests.map((request) => {
    const circle = appState.availableCircles.find((item) => item.id === request.circle_id);
    const slot = appState.circleUserSlots.find((item) => item.id === request.slot_id);
    const statusInfo = activationRequestStatus(request.status);

    return `
      <tr>
        <td>${formatDate(request.created_at)}</td>
        <td>
          <span class="member-name small-name">${escapeHtml(circle?.name || "Nieznane koło")}</span>
          ${circle?.short_name ? `<span class="table-note">${escapeHtml(circle.short_name)}</span>` : ""}
        </td>
        <td>${escapeHtml(slot?.slot_name || "Miejsce użytkownika")}</td>
        <td>
          <span class="member-name small-name">${escapeHtml(request.requested_display_name || "Użytkownik")}</span>
          ${request.request_notes ? `<span class="table-note">${escapeHtml(request.request_notes)}</span>` : ""}
        </td>
        <td>
          <span>${escapeHtml(request.requested_email || "-")}</span>
          ${request.requested_phone ? `<span class="table-note">Tel. ${escapeHtml(request.requested_phone)}</span>` : ""}
        </td>
        <td><span class="status-pill role-pill">${escapeHtml(roleLabel(request.requested_role))}</span></td>
        <td><span class="status-pill ${statusInfo.className}">${statusInfo.label}</span></td>
        <td class="table-actions">
          ${request.status === "pending" ? `
            <button type="button" onclick="window.markActivationRequestActivated('${request.id}')">Oznacz aktywowane</button>
            <button type="button" class="secondary" onclick="window.rejectActivationRequest('${request.id}')">Odrzuć</button>
          ` : `<span class="table-note">Zakończone</span>`}
        </td>
      </tr>`;
  }).join("");
}

function activationRequestStatus(status) {
  const map = {
    pending: { label: "Oczekuje", className: "status-due" },
    activated: { label: "Aktywowane", className: "status-active" },
    rejected: { label: "Odrzucone", className: "status-cancelled" },
    cancelled: { label: "Anulowane", className: "status-cancelled" }
  };

  return map[status] || { label: status || "-", className: "status-exempt" };
}

function showActivationRequestForm(slotId) {
  if (!canManageUsers()) {
    showToast("Brak uprawnień do zgłaszania użytkowników.", "error");
    return;
  }

  const slot = appState.circleUserSlots.find((item) => item.id === slotId);
  if (!slot) {
    showToast("Nie znaleziono miejsca użytkownika.", "error");
    return;
  }

  if (slot.status !== "available") {
    showToast("To miejsce nie jest wolne do aktywacji.", "error");
    return;
  }

  appState.editingActivationSlot = slot;

  setInputValue("activationRequestSlotIdInput", slot.id);
  setInputValue("activationRequestSlotNameInput", slot.slot_name || "Użytkownik");
  setInputValue("activationRequestDisplayNameInput", "");
  setInputValue("activationRequestEmailInput", "");
  setInputValue("activationRequestPhoneInput", "");
  setInputValue("activationRequestRoleInput", slot.default_role || "staff");
  setInputValue("activationRequestNotesInput", "");

  document.getElementById("activationRequestFormBox")?.classList.remove("hidden");
  document.getElementById("activationRequestDisplayNameInput")?.focus();
}

function hideActivationRequestForm() {
  appState.editingActivationSlot = null;
  document.getElementById("activationRequestFormBox")?.classList.add("hidden");
  setInputValue("activationRequestSlotIdInput", "");
  setInputValue("activationRequestSlotNameInput", "");
  setInputValue("activationRequestDisplayNameInput", "");
  setInputValue("activationRequestEmailInput", "");
  setInputValue("activationRequestPhoneInput", "");
  setInputValue("activationRequestRoleInput", "staff");
  setInputValue("activationRequestNotesInput", "");
}

async function handleActivationRequestSubmit(event) {
  event.preventDefault();

  if (!canManageUsers()) {
    showToast("Brak uprawnień do zgłaszania użytkowników.", "error");
    return;
  }

  const circleId = getActiveCircleId();
  const slotId = document.getElementById("activationRequestSlotIdInput")?.value.trim();
  const slot = appState.circleUserSlots.find((item) => item.id === slotId);

  if (!circleId || !slot) {
    showToast("Brak aktywnego koła albo miejsca użytkownika.", "error");
    return;
  }

  const displayName = document.getElementById("activationRequestDisplayNameInput")?.value.trim();
  const email = document.getElementById("activationRequestEmailInput")?.value.trim();
  const phone = document.getElementById("activationRequestPhoneInput")?.value.trim();
  const role = document.getElementById("activationRequestRoleInput")?.value;
  const notes = document.getElementById("activationRequestNotesInput")?.value.trim();

  if (!displayName || !email) {
    showToast("Imię/nazwa oraz e-mail są wymagane.", "error");
    return;
  }

  if (!["circle_admin", "staff", "accountant_readonly"].includes(role)) {
    showToast("Nieprawidłowa rola użytkownika.", "error");
    return;
  }

  const existingPending = appState.userActivationRequests.find((request) =>
    request.slot_id === slotId && request.status === "pending"
  );

  if (existingPending) {
    showToast("Dla tego miejsca istnieje już zgłoszenie oczekujące.", "error");
    return;
  }

  const requestPayload = {
    circle_id: circleId,
    slot_id: slotId,
    requested_display_name: displayName,
    requested_email: email,
    requested_phone: phone || null,
    requested_role: role,
    request_notes: notes || null,
    status: "pending",
    created_by: appState.user?.id || null
  };

  const { error: requestError } = await appState.supabase
    .from("user_activation_requests")
    .insert(requestPayload);

  if (requestError) {
    console.error(requestError);
    showToast("Nie udało się wysłać zgłoszenia aktywacji.", "error");
    return;
  }

  const { error: slotError } = await appState.supabase
    .from("circle_user_slots")
    .update({
      default_role: role,
      assigned_email: email,
      assigned_display_name: displayName,
      status: "invited",
      notes: "Zgłoszenie aktywacji wysłane do administratora programu.",
      updated_at: new Date().toISOString()
    })
    .eq("id", slotId)
    .eq("circle_id", circleId);

  if (slotError) {
    console.error(slotError);
    showToast("Zgłoszenie zapisano, ale nie udało się zaktualizować miejsca użytkownika.", "error");
  }

  hideActivationRequestForm();
  await loadCircleUsers();
  await loadActivationRequests();

  showToast("Zgłoszenie zostało wysłane. Ze względów bezpieczeństwa weryfikacja aktywacji użytkownika może potrwać do 24 godzin.");
}

async function cancelActivationRequestForSlot(slotId) {
  if (!canManageUsers()) return;

  const circleId = getActiveCircleId();
  const pending = (appState.userActivationRequests || []).find((request) =>
    request.slot_id === slotId && request.circle_id === circleId && request.status === "pending"
  );

  if (pending) {
    const { error } = await appState.supabase
      .from("user_activation_requests")
      .update({
        status: "cancelled",
        admin_notes: "Zgłoszenie anulowane z poziomu panelu koła.",
        reviewed_at: new Date().toISOString(),
        reviewed_by: appState.user?.id || null,
        updated_at: new Date().toISOString()
      })
      .eq("id", pending.id);

    if (error) {
      console.error(error);
      showToast("Nie udało się anulować zgłoszenia.", "error");
      return;
    }
  }

  const { error: slotError } = await appState.supabase
    .from("circle_user_slots")
    .update({
      assigned_email: null,
      assigned_display_name: null,
      status: "available",
      notes: "Wolne miejsce do aktywacji przez administratora koła.",
      updated_at: new Date().toISOString()
    })
    .eq("id", slotId)
    .eq("circle_id", circleId);

  if (slotError) {
    console.error(slotError);
    showToast("Nie udało się przywrócić miejsca użytkownika.", "error");
    return;
  }

  await loadCircleUsers();
  await loadActivationRequests();
  showToast("Zgłoszenie zostało anulowane.");
}

function showActivationRequestForSlot(slotId) {
  const pending = (appState.userActivationRequests || []).find((request) =>
    request.slot_id === slotId && request.status === "pending"
  );

  if (!pending) {
    showToast("Brak aktywnego zgłoszenia dla tego miejsca.", "error");
    return;
  }

  showToast(`Zgłoszenie oczekuje: ${pending.requested_display_name}, ${pending.requested_email}.`);
}

async function markActivationRequestActivated(requestId) {
  if (!isSuperAdmin()) return;

  const request = (appState.userActivationRequests || []).find((item) => item.id === requestId);
  if (!request) return;

  const { data: matchingProfiles, error: profileLookupError } = await appState.supabase
    .from("profiles")
    .select("user_id, email, display_name, role, is_active")
    .eq("circle_id", request.circle_id)
    .ilike("email", request.requested_email)
    .limit(1);

  if (profileLookupError) {
    console.error(profileLookupError);
    showToast("Nie udało się sprawdzić profilu użytkownika.", "error");
    return;
  }

  const profile = (matchingProfiles || [])[0];

  if (!profile) {
    showToast("Najpierw utwórz konto w Supabase Auth i profil użytkownika dla tego e-maila, potem oznacz zgłoszenie jako aktywowane.", "error");
    return;
  }

  const { error: slotError } = await appState.supabase
    .from("circle_user_slots")
    .update({
      assigned_user_id: profile.user_id,
      assigned_email: profile.email || request.requested_email,
      assigned_display_name: profile.display_name || request.requested_display_name,
      default_role: profile.role || request.requested_role,
      status: "active",
      notes: "Użytkownik aktywowany przez administratora programu.",
      updated_at: new Date().toISOString()
    })
    .eq("id", request.slot_id);

  if (slotError) {
    console.error(slotError);
    showToast("Nie udało się aktywować miejsca użytkownika.", "error");
    return;
  }

  const { error: requestError } = await appState.supabase
    .from("user_activation_requests")
    .update({
      status: "activated",
      reviewed_by: appState.user?.id || null,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq("id", request.id);

  if (requestError) {
    console.error(requestError);
    showToast("Miejsce aktywowano, ale nie udało się zamknąć zgłoszenia.", "error");
  }

  await loadActivationRequests();
  await loadCircleUsers();
  showToast("Zgłoszenie oznaczone jako aktywowane.");
}

async function rejectActivationRequest(requestId) {
  if (!isSuperAdmin()) return;

  const request = (appState.userActivationRequests || []).find((item) => item.id === requestId);
  if (!request) return;

  const { error: requestError } = await appState.supabase
    .from("user_activation_requests")
    .update({
      status: "rejected",
      reviewed_by: appState.user?.id || null,
      reviewed_at: new Date().toISOString(),
      admin_notes: "Zgłoszenie odrzucone przez administratora programu.",
      updated_at: new Date().toISOString()
    })
    .eq("id", request.id);

  if (requestError) {
    console.error(requestError);
    showToast("Nie udało się odrzucić zgłoszenia.", "error");
    return;
  }

  if (request.slot_id) {
    await appState.supabase
      .from("circle_user_slots")
      .update({
        assigned_email: null,
        assigned_display_name: null,
        status: "available",
        notes: "Wolne miejsce do aktywacji przez administratora koła.",
        updated_at: new Date().toISOString()
      })
      .eq("id", request.slot_id);
  }

  await loadActivationRequests();
  await loadCircleUsers();
  showToast("Zgłoszenie zostało odrzucone.");
}



function renderCirclesList() {
  const list = document.getElementById("circlesList");
  if (!list) return;

  if (!isSuperAdmin()) {
    list.innerHTML = "";
    return;
  }

  if (!appState.availableCircles.length) {
    list.innerHTML = `<tr><td colspan="6">Brak kół w programie.</td></tr>`;
    return;
  }

  list.innerHTML = appState.availableCircles.map((circle) => {
    const isActive = circle.id === getActiveCircleId();
    const statusText = circleStatusLabel(circle.status);
    const contact = [circle.contact_email, circle.contact_phone].filter(Boolean).join("<br>") || "-";

    return `
      <tr class="${isActive ? "selected-row" : ""}">
        <td>
          <div class="circle-table-name">
            <span class="circle-table-logo">${circleLogoHtml(circle)}</span>
            <span>
              <span class="member-name">${escapeHtml(circle.name)}</span>
              ${circle.short_name ? `<span class="table-note">${escapeHtml(circle.short_name)}</span>` : ""}
            </span>
          </div>
        </td>
        <td><span class="status-pill ${circleStatusClass(circle.status)}">${statusText}</span></td>
        <td class="amount-cell">${formatMoney(circle.membership_fee_amount || 0)}</td>
        <td>${getCircleStorageLimitMb(circle)} MB</td>
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
    showToast("Nie udało się zmienić statusu koła.");
    return;
  }

  await loadAvailableCircles();
  appState.circle = getActiveCircle();
  renderUserInfo();
  renderSuperAdminUi();
  renderStorageLimitsList();
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
window.handleEditCircleUser = handleEditCircleUser;
window.handleToggleCircleUser = handleToggleCircleUser;
window.handleActivateCircleUserSlot = handleActivateCircleUserSlot;
window.handleEditCircleUserSlot = handleEditCircleUserSlot;
window.handleDeactivateCircleUserSlot = handleDeactivateCircleUserSlot;
window.showActivationRequestForSlot = showActivationRequestForSlot;
window.cancelActivationRequestForSlot = cancelActivationRequestForSlot;
window.markActivationRequestActivated = markActivationRequestActivated;
window.rejectActivationRequest = rejectActivationRequest;


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


// =========================================================
// LOGO KOŁA
// =========================================================

function getCircleLogoPath(circle = getActiveCircle()) {
  return circle?.logo_url || "";
}

function getLogoUrl(logoPath) {
  if (!logoPath) return "";
  if (/^https?:\/\//i.test(logoPath)) return logoPath;

  try {
    const { data } = appState.supabase
      .storage
      .from("logos")
      .getPublicUrl(logoPath);

    return data?.publicUrl || "";
  } catch {
    return "";
  }
}

function circleInitials(circle = getActiveCircle()) {
  const source = (circle?.short_name || circle?.name || "KGW").trim();
  if (!source) return "KGW";

  const words = source.split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();

  return words
    .slice(0, 3)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function renderLogoPreview(elementId, logoPath, fallbackText = "KGW") {
  const el = document.getElementById(elementId);
  if (!el) return;

  const url = getLogoUrl(logoPath);

  if (url) {
    el.innerHTML = `<img src="${escapeHtml(url)}" alt="Logo koła" />`;
    el.classList.add("has-logo");
  } else {
    el.textContent = String(fallbackText || "KGW").slice(0, 6);
    el.classList.remove("has-logo");
  }
}

function renderCircleLogos() {
  const circle = getActiveCircle();
  const logoPath = getCircleLogoPath(circle);
  const fallback = circleInitials(circle);

  renderLogoPreview("sidebarLogoMark", logoPath, fallback);
  renderLogoPreview("dashboardLogoBox", logoPath, fallback);
  renderLogoPreview("activeCircleLogoPreview", logoPath, fallback);
}

function circleLogoHtml(circle) {
  const logoPath = getCircleLogoPath(circle);
  const url = getLogoUrl(logoPath);
  const fallback = circleInitials(circle);

  if (url) {
    return `<span class="circle-mini-logo has-logo"><img src="${escapeHtml(url)}" alt="Logo koła" /></span>`;
  }

  return `<span class="circle-mini-logo">${escapeHtml(fallback)}</span>`;
}

function triggerCircleLogoUpload() {
  if (!canManageCircleSettings()) {
    showToast("Brak uprawnień do zmiany logo koła.", "error");
    return;
  }

  const input = document.getElementById("circleLogoUploadInput");
  if (!input) return;
  input.value = "";
  input.click();
}

async function handleCircleLogoSelected(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const circleId = getActiveCircleId();
  const circle = getActiveCircle();

  if (!circleId || !circle) {
    showToast("Brak aktywnego koła.", "error");
    return;
  }

  if (!canManageCircleSettings()) {
    showToast("Brak uprawnień do zmiany logo koła.", "error");
    return;
  }

  const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    showToast("Logo musi być plikiem PNG, JPG albo WEBP.", "error");
    event.target.value = "";
    return;
  }

  const maxBytes = 1024 * 1024;
  if (file.size > maxBytes) {
    showToast("Logo jest za duże. Maksymalny rozmiar to 1 MB.", "error");
    event.target.value = "";
    return;
  }

  const oldLogoPath = getCircleLogoPath(circle);
  const safeFileName = sanitizeFileName(file.name);
  const storagePath = `${circleId}/logo-${Date.now()}-${crypto.randomUUID()}-${safeFileName}`;

  const { error: uploadError } = await appState.supabase
    .storage
    .from("logos")
    .upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false
    });

  if (uploadError) {
    console.error(uploadError);
    showToast("Nie udało się wgrać logo. Sprawdź bucket logos i polityki dostępu.", "error");
    event.target.value = "";
    return;
  }

  const { error: updateError } = await appState.supabase
    .from("circles")
    .update({ logo_url: storagePath })
    .eq("id", circleId);

  if (updateError) {
    console.error(updateError);
    showToast("Logo zostało wgrane, ale nie udało się zapisać go w danych koła.", "error");
    event.target.value = "";
    return;
  }

  if (oldLogoPath && oldLogoPath !== storagePath && !/^https?:\/\//i.test(oldLogoPath)) {
    await appState.supabase.storage.from("logos").remove([oldLogoPath]);
  }

  await loadAvailableCircles();
  appState.circle = getActiveCircle();
  renderUserInfo();
  renderSuperAdminUi();
  showToast("Logo koła zostało zapisane.");
  event.target.value = "";
}

async function removeCircleLogo() {
  const circleId = getActiveCircleId();
  const circle = getActiveCircle();
  const oldLogoPath = getCircleLogoPath(circle);

  if (!circleId || !circle) {
    showToast("Brak aktywnego koła.", "error");
    return;
  }

  if (!oldLogoPath) {
    showToast("To koło nie ma jeszcze logo.", "info");
    return;
  }

  const { error } = await appState.supabase
    .from("circles")
    .update({ logo_url: null })
    .eq("id", circleId);

  if (error) {
    console.error(error);
    showToast("Nie udało się usunąć logo.", "error");
    return;
  }

  if (!/^https?:\/\//i.test(oldLogoPath)) {
    await appState.supabase.storage.from("logos").remove([oldLogoPath]);
  }

  await loadAvailableCircles();
  appState.circle = getActiveCircle();
  renderUserInfo();
  renderSuperAdminUi();
  showToast("Logo koła zostało usunięte.");
}

// =========================================================
// POMOC
// =========================================================

function showHelpTab(tabName = "instruction") {
  document.querySelectorAll(".help-tab").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.helpTab === tabName);
  });

  document.querySelectorAll(".help-panel").forEach((panel) => {
    panel.classList.remove("active-help-panel");
  });

  const mapping = {
    instruction: "helpInstruction",
    contact: "helpContact",
    updates: "helpUpdates",
    about: "helpAbout"
  };

  document.getElementById(mapping[tabName] || "helpInstruction")?.classList.add("active-help-panel");
}


function showView(viewName) {
  if (viewName === "superAdmin" && !isSuperAdmin()) {
    viewName = "dashboard";
  }

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

// =========================================================
// POWIADOMIENIA / TOASTY
// =========================================================

function showAdminContactModal() {
  const modal = document.getElementById("adminContactModal");
  modal?.classList.remove("hidden");
  document.body.classList.add("modal-open");
}

function hideAdminContactModal() {
  const modal = document.getElementById("adminContactModal");
  modal?.classList.add("hidden");
  document.body.classList.remove("modal-open");
}

function showToast(message, type = "") {
  const container = document.getElementById("toastContainer");
  const text = String(message || "").trim();

  if (!text) return;

  const normalizedType = type || detectToastType(text);

  if (!container) {
    console.log(text);
    return;
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${normalizedType}`;
  toast.setAttribute("role", normalizedType === "error" ? "alert" : "status");

  const icon = document.createElement("span");
  icon.className = "toast-icon";
  icon.textContent = getToastIcon(normalizedType);

  const body = document.createElement("div");
  body.className = "toast-body";
  body.textContent = text;

  const closeBtn = document.createElement("button");
  closeBtn.className = "toast-close";
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Zamknij powiadomienie");
  closeBtn.textContent = "×";

  closeBtn.addEventListener("click", () => removeToast(toast));

  toast.appendChild(icon);
  toast.appendChild(body);
  toast.appendChild(closeBtn);

  container.appendChild(toast);

  window.setTimeout(() => {
    removeToast(toast);
  }, normalizedType === "error" ? 6500 : 3800);
}

function detectToastType(message) {
  const text = String(message || "").toLowerCase();

  if (
    text.includes("nie udało") ||
    text.includes("błąd") ||
    text.includes("brak ") ||
    text.includes("podaj ") ||
    text.includes("wymagana") ||
    text.includes("sprawdź") ||
    text.includes("nie można")
  ) {
    return "error";
  }

  if (
    text.includes("został") ||
    text.includes("została") ||
    text.includes("zapisano") ||
    text.includes("dodane") ||
    text.includes("dodany") ||
    text.includes("utworzono") ||
    text.includes("usunięte") ||
    text.includes("usunięty")
  ) {
    return "success";
  }

  return "info";
}

function getToastIcon(type) {
  if (type === "success") return "✓";
  if (type === "error") return "!";
  return "i";
}

function removeToast(toast) {
  if (!toast || toast.classList.contains("toast-hide")) return;

  toast.classList.add("toast-hide");

  window.setTimeout(() => {
    toast.remove();
  }, 220);
}
