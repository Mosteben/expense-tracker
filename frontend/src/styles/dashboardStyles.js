import { ACCENT, GREEN } from "../constants/theme";

export const card = {
  background: "rgba(255,255,255,0.78)",
  border: "0.5px solid rgba(192,98,47,0.12)",
  borderRadius: 18,
  padding: "20px 22px",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
};

const styles = {
  // ── Loading ──
  loadWrap:    { display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#f5f0eb" },
  loadSpinner: { width:36, height:36, border:"3px solid #fdf0ea", borderTop:`3px solid ${ACCENT}`, borderRadius:"50%", animation:"spin 0.8s linear infinite" },

  // ── Layout ──
  dash:    { display:"flex", minHeight:"100vh", background:"#f5f0eb", fontFamily:"'Inter', Arial, sans-serif" },
  main:    { flex:1, display:"flex", flexDirection:"column", overflow:"hidden" },
  content: { flex:1, padding:"0 28px 28px", overflowY:"auto" },

  // ── Sidebar ──
  sidebar:      { width:64, background:"rgba(255,255,255,0.7)", borderRight:"0.5px solid rgba(192,98,47,0.12)", display:"flex", flexDirection:"column", alignItems:"center", padding:"24px 0", gap:8, flexShrink:0 },
  sbLogo:       { width:36, height:36, background:"#fdf0ea", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16, border:"1px solid rgba(192,98,47,0.2)", cursor:"default" },
  sbItem:       { width:40, height:40, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#a8a29e", fontSize:18, transition:"background 0.2s" },
  sbItemActive: { background:"#fdf0ea", color:ACCENT },

  // ── Topbar ──
  topbar:    { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 28px 12px" },
  topTitle:  { fontSize:20, fontWeight:700, color:"#1c1917", margin:0 },
  topSub:    { fontSize:13, color:"#78716c", marginTop:2 },
  topRight:  { display:"flex", alignItems:"center", gap:12 },
  searchBox: { display:"flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.8)", border:"0.5px solid rgba(192,98,47,0.15)", borderRadius:10, padding:"8px 14px", fontSize:13, color:"#a8a29e", cursor:"text" },
  bellBtn:   { width:36, height:36, background:"rgba(255,255,255,0.8)", border:"0.5px solid rgba(192,98,47,0.15)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:16 },
  avatar:    { width:36, height:36, borderRadius:"50%", background:ACCENT, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#fff", cursor:"pointer", border:`2px solid rgba(192,98,47,0.25)` },
  backBtn:   { width:34, height:34, borderRadius:10, border:"0.5px solid rgba(192,98,47,0.2)", background:"rgba(255,255,255,0.8)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:ACCENT },
  addExpBtn: { display:"flex", alignItems:"center", gap:6, background:ACCENT, border:"none", borderRadius:10, padding:"8px 16px", fontSize:13, fontWeight:600, color:"#fff", cursor:"pointer" },

  // ── Stat cards ──
  statGrid:  { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 },
  statCard:  { ...card, cursor:"default" },
  statCardHL:{ background:ACCENT, borderColor:ACCENT },
  statLabel: { fontSize:12, color:"#78716c", fontWeight:500, marginBottom:10 },
  statValue: { fontSize:22, fontWeight:700, color:"#1c1917", marginBottom:6 },

  // ── Charts ──
  chartsRow:   { display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 },
  chartCard:   { ...card },
  chartHeader: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 },
  chartTitle:  { fontSize:14, fontWeight:700, color:"#1c1917" },
  legend:      { display:"flex", gap:12 },
  tooltip:     { background:"#fff", border:"0.5px solid rgba(192,98,47,0.15)", borderRadius:8, fontSize:12 },

  // ── Bottom row ──
  bottomRow:   { display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 },
  bottomCard:  { ...card },
  bottomTitle: { fontSize:14, fontWeight:700, color:"#1c1917", marginBottom:14 },
  actionBtn:   { display:"flex", alignItems:"center", gap:8, background:"#fdf0ea", border:"0.5px solid rgba(192,98,47,0.2)", borderRadius:12, padding:"12px 14px", cursor:"pointer", fontSize:12, fontWeight:600, color:ACCENT, transition:"background 0.2s, transform 0.15s" },
  txnItem:     { display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:"0.5px solid rgba(192,98,47,0.08)" },
  txnAvatar:   { width:34, height:34, borderRadius:"50%", background:"#fdf0ea", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:ACCENT, flexShrink:0 },
  txnAvatarPos:{ background:"#e8f5e9", color:"#3B6D11" },
  txnName:     { fontSize:13, fontWeight:600, color:"#1c1917" },
  txnCat:      { fontSize:11, color:"#78716c" },
  txnAmt:      { fontSize:13, fontWeight:700 },

  // ── Expenses / Income pages ──
  expSummaryRow:   { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 },
  expSummaryCard:  { ...card, cursor:"default" },
  expSummaryLabel: { fontSize:12, color:"#78716c", fontWeight:500, marginBottom:8 },
  expSummaryValue: { fontSize:20, fontWeight:700, color:"#1c1917" },
  listCard:        { ...card, padding:0, overflow:"hidden" },
  tableHead:       { display:"flex", alignItems:"center", padding:"12px 20px", background:"#fdf0ea", fontSize:11, fontWeight:600, color:"#78716c", textTransform:"uppercase", letterSpacing:"0.04em", borderBottom:"0.5px solid rgba(192,98,47,0.1)" },
  tableRow:        { display:"flex", alignItems:"center", padding:"14px 20px", borderBottom:"0.5px solid rgba(192,98,47,0.07)" },
  rowIcon:         { width:36, height:36, borderRadius:10, background:"#fdf0ea", border:"0.5px solid rgba(192,98,47,0.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
  rowTitle:        { fontSize:13, fontWeight:600, color:"#1c1917" },
  rowDesc:         { fontSize:11, color:"#78716c", marginTop:2 },
  badge:           { display:"inline-flex", alignItems:"center", gap:4, fontSize:11, fontWeight:600, color:ACCENT, background:"#fdf0ea", border:"0.5px solid rgba(192,98,47,0.2)", borderRadius:6, padding:"3px 8px" },
  emptyState:      { display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"60px 20px", gap:10 },
  emptyIcon:       { width:56, height:56, borderRadius:16, background:"#fdf0ea", border:"0.5px solid rgba(192,98,47,0.15)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:6 },
  emptyTitle:      { fontSize:15, fontWeight:700, color:"#1c1917" },
  emptySub:        { fontSize:13, color:"#78716c" },
  emptyBtn:        { display:"flex", alignItems:"center", gap:6, marginTop:8, background:ACCENT, border:"none", borderRadius:10, padding:"9px 18px", fontSize:13, fontWeight:600, color:"#fff", cursor:"pointer" },

  // ── Modal ──
  modalOverlay: { position:"fixed", inset:0, background:"rgba(28,25,23,0.45)", display:"flex", justifyContent:"center", alignItems:"center", zIndex:999 },
  modal:        { background:"#fff", borderRadius:20, width:460, border:"0.5px solid rgba(192,98,47,0.15)", overflow:"hidden", fontFamily:"'Inter', Arial, sans-serif" },
  modalHeader:  { padding:"20px 24px 16px", borderBottom:"0.5px solid rgba(192,98,47,0.1)", display:"flex", alignItems:"center", justifyContent:"space-between" },
  modalIcon:    { width:36, height:36, background:"#fdf0ea", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", border:"0.5px solid rgba(192,98,47,0.2)" },
  modalTitle:   { fontSize:15, fontWeight:700, color:"#1c1917" },
  modalSub:     { fontSize:12, color:"#78716c", marginTop:1 },
  closeBtn:     { width:30, height:30, borderRadius:8, border:"0.5px solid rgba(192,98,47,0.15)", background:"transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" },
  modalBody:    { padding:"20px 24px", display:"flex", flexDirection:"column", gap:14 },
  fieldLabel:   { fontSize:11, fontWeight:600, color:"#78716c", textTransform:"uppercase", letterSpacing:"0.04em", marginBottom:5 },
  fieldInput:   { fontSize:13, color:"#1c1917", background:"#fafaf9", border:"0.5px solid rgba(192,98,47,0.2)", borderRadius:10, padding:"9px 12px", width:"100%", outline:"none", fontFamily:"'Inter', Arial, sans-serif" },
  amountSymbol: { position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:11, fontWeight:600, color:ACCENT, pointerEvents:"none" },
  catGrid:      { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:7 },
  catChip:      { border:"0.5px solid rgba(192,98,47,0.16)", borderRadius:10, background:"#fafaf9", padding:"9px 4px 8px", display:"flex", flexDirection:"column", alignItems:"center", gap:5, cursor:"pointer", fontSize:10, fontWeight:600, color:"#78716c", transition:"all 0.15s", userSelect:"none" },
  catChipActive:{ background:"#fdf0ea", borderColor:"rgba(192,98,47,0.45)", color:ACCENT },
  modalFooter:  { padding:"12px 24px 20px", display:"flex", gap:10, borderTop:"0.5px solid rgba(192,98,47,0.08)" },
  btnCancel:    { flex:1, padding:10, borderRadius:12, border:"0.5px solid rgba(192,98,47,0.2)", background:"transparent", fontSize:13, fontWeight:600, color:"#78716c", cursor:"pointer", fontFamily:"inherit" },
  btnSave:      { flex:2, padding:10, borderRadius:12, border:"none", background:ACCENT, fontSize:13, fontWeight:700, color:"#fff", cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:7 },
};

export default styles;