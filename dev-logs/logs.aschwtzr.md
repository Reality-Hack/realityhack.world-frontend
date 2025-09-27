ˇ**Friday Sept 26**
What I did
- Improve handling of new user created hardware device with state for just that device (as opposed to all devices + the new one)
- Fix bug with missing team ID when requesting hardware
- Add loading state to auth context hook 

ˇ**Thurs Sept 25**
What I did
- Reorganize hardware related components into smaller, single responsibility components

**Wed Sept 24**
What I did
- Refactor reusable TeamsForm out of participant team page for reuse in admin

**Tues Sept 23**
What I did
- Refactor participant hardware to use common context for hardware browser and hardware requests pages
- Clean up admin landing page by removing duplicate tiles and single icon

**Thurs Sept 18**
What I did
- Cache busting and prevent client side on attendees endpoint to allow optimistic updates
- Improve loading state for team form by showing loading animation when attendees are loading

**Mon Sept. 15 - Wed Sept. 17**

What I did
- Refactor teams form to isolate business logic away from implementing components
- Use SWR hooks for teams and team pages
- Create useAttendees hook to improve rendering inside admin teams pages

Up next
- Refactor applications
- Scope task to segment data by year

**Sunday Sept. 14**

What I did
- Optimistically update checkin UI 

**Friday Sept. 12**

What I did
- Created context hook for Attendees and Attendee
- refactored checkin to use the new hook
- Added cache busting to Attendee list endpoint so that checkin refreshes after action
  - Still takes about 30s to return 

What's next
- upgrate Teams page

**Wednesday Sept. 10**

What I did
- Fix create new hardware button

What's broken
- Creating a new device type was resetting the new device. May need to become a separate managed state 

**Sunday Sept. 7**

What I did 
- Refactor hardware scanner
- Fix Serial barcode read
- Fix Id barcode read
- Finish refactoring hardware editor to use Orval

**Friday Aug 29**

What I did 
- refactor hardware category / hardware tag into single type with TagsEnum as key 
- refactor hardware editor card and subcomponents to use generated endpoints and types
- clean out handcrafted hardware API and type interfaces except for scanner. That one needs to be better understood first. 
- Deploy both applications to dev environment

What's next
- Need to ensure hardware scanner still works
- Test functionality and write tests for hardware pages
- Finish HardwareEditor
  - Edit Tags
  - Save changes


**Friday Aug 22**

What I did 
- Continue refactoring HardwareEditor
- Create logs directory to track async dev work 

**Thursday Aug 21**

What I did 
- Worked on refactoring HardwareEditor to use generated types and endpoints

**Monday Aug 11**

What I did 
- Working through strategy for refactoring the hardware checkout table
What's next 
- Finish the pattern by implementing one of the suggested patterns

**Sunday Aug 10**

What I did 
- Worked on row rendering for hardware checkout but I think the current library is not the best to work with
What's next 
- Look into implementing an alternative library

**Monday July 28**

What I did 
- updated hardware request to use swr
What's next 
- Finish refactoring hardware: admin, requested, etc

**Monday July 28**

What I did 
- Finish refactoring types and cleaning up code for hardware checkout page
- Fixed issue with generated models due to missing serializers in function def
- Removed all filter from hardware since it's redundant (selecting none shows all)
- Tmobile unblocked dev after resetting the modem

What's next 
- Admin page is still using the old hardware API

What's weird or broke
- The requested hardware component is long and hard to follow. The table should be a new component
- Clicking through to either tab sends out the request again which takes forever. Should switch to SWR and also handle tabs differently, potentially ditching the nested page architecture

**Sunday July 27**

What I did 
- work orval into hardware request tab
- Start refactoring and cleaning up hardware req feature
- Fix orval requests issue with the url and proxy with a custom axios

What's next 
- Fix filter options with custom type implementation
- Ensure both components are client components 
- Continue refactoring

What's weird or broke
- Orval with the current spectacular schema is very weird. I suspect some of the backend defs are not right
- TMobile is blocking the dev API for me

**Saturday July 26**

What I did 
- Fix deployment issues with types and Orval
- Updated dev frontend and backend repos 
- Opened dev to main PR

What's next 
- Start picking off updates to individual components
- Delete stuff!!!

What's weird or broke
- Orval models are inconsistently generating labels/enum file names
- Took a while to wrangle Orval. It kept generating schema models