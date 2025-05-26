# V3 Upgrade Execution Notes - CRITICAL REMINDERS

## 🚨 SCOPE BOUNDARIES - READ THIS FIRST

1. **ONLY GLOBAL PERSONAS GET v3 UPGRADE** - CEO, CHRO, Sales, Talent, Rewards, Leadership Dev
2. **REGIONAL PERSONAS (AUS, UK, UAE) STAY v1** - They continue using `CountryPersonaTemplate.tsx` with existing v1 layout
3. **DO NOT TOUCH REGIONAL PERSONA TEMPLATES OR DATA**

## 🎯 EXACT REQUIREMENTS

1. **Archive v1 global personas** to `data/archive/global_v1/`
2. **Move v3 personas** from `public/data/global/` to `data/global/` (rename from `*_v3.json` to `*.json`)
3. **Update GlobalPersonaTemplate.tsx** to use v3 structure (based on experimental version)
4. **Keep experimental version** for future development
5. **Update types** to support both v1 (regional) and v3 (global) personas

## 🔧 TECHNICAL APPROACH

1. **Data Migration First** - Move files, don't break anything
2. **Update Types** - Add v3 interfaces while keeping v1 for regional
3. **Update API** - Handle both v1 and v3 formats
4. **Update Components** - Replace GlobalPersonaTemplate.tsx only
5. **Test Everything** - Verify both global and regional personas work

## ⚠️ WHAT NOT TO DO (LESSONS FROM PREVIOUS FUCKUP)

1. **DO NOT replace CountryPersonaTemplate.tsx** - Regional personas use this
2. **DO NOT modify regional persona data** - Leave AUS/UK/UAE alone
3. **DO NOT break the routing logic** - Global vs Regional routing must work
4. **DO NOT remove duplicate sections** without understanding what they do
5. **DO NOT assume anything** - Read the code before changing it

## ✅ SUCCESS CRITERIA

1. Global personas (CEO, CHRO, etc.) show v3 layout with hierarchical structure
2. Regional personas (Australia CEO, UK CEO, etc.) show v1 layout unchanged
3. No duplication of personas on the page
4. All data displays correctly
5. No TypeScript errors

## 🔄 STEP-BY-STEP EXECUTION ORDER

1. **Archive v1 global data** (backup first)
2. **Move v3 data to main location**
3. **Update TypeScript types** (add v3 support)
4. **Update API to handle v3** (maintain v1 support for regional)
5. **Replace GlobalPersonaTemplate.tsx** (keep experimental intact)
6. **Test thoroughly** before declaring success

## 📝 EXECUTION LOG

- [x] Step 1: Archive v1 global data
- [x] Step 2: Move v3 data to main location
- [x] Step 3: Update TypeScript types
- [x] Step 4: Update API to handle v3 (COMPLETED - v3 detection working)
- [x] Step 5: Replace GlobalPersonaTemplate.tsx
- [x] Step 6: Fix routing logic (PersonaDetailsContent.tsx)
- [ ] Step 7: Test thoroughly (ready for testing)

**REMEMBER: SLOW AND CAREFUL. READ BEFORE CHANGING. TEST AFTER EACH STEP.**
