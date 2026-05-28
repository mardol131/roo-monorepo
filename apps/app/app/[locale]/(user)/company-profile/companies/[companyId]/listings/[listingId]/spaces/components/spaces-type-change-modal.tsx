"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Space } from "@roo/common";
import ModalLayout from "@/app/components/ui/molecules/modal-layout";
import Button from "@/app/components/ui/atoms/button";
import Input from "@/app/components/ui/atoms/inputs/input";
import SelectInput from "@/app/components/ui/atoms/inputs/select-input";
import Text from "@/app/components/ui/atoms/text";
import { createSpace } from "@/app/react-query/spaces/fetch";
import { updateSpace } from "@/app/react-query/spaces/fetch";
import { useUpdateListingDetail } from "@/app/react-query/listings/hooks";
import { spaceKeys } from "@/app/react-query/query-keys";
import { Plus, Trash2 } from "lucide-react";

type SpacesType = Space["type"];

const HIERARCHY: Record<SpacesType, number> = {
  area: 0,
  building: 1,
  room: 2,
};

function getParentId(space: Space): string | null {
  if (!space.parent) return null;
  if (typeof space.parent === "string") return space.parent;
  return space.parent.id;
}

const TYPES_BY_LEVEL: SpacesType[] = ["area", "building", "room"];

type NewParent = {
  tempId: string;
  name: string;
};

type NewIntermediate = {
  tempId: string;
  name: string;
  parentTempId: string | null;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentType: SpacesType;
  newType: SpacesType;
  allSpaces: Space[];
  listingId: string;
  venueDetailId: string;
  onSuccess: () => void;
}

export default function SpacesTypeChangeModal({
  isOpen,
  onClose,
  currentType,
  newType,
  allSpaces,
  listingId,
  venueDetailId,
  onSuccess,
}: Props) {
  const queryClient = useQueryClient();
  const { mutateAsync: saveListingDetail } = useUpdateListingDetail(
    "listing-venue-details",
  );
  const t = useTranslations("components.spacesTypeChangeModal");
  const g = useTranslations("global");

  const gl = (
    type: SpacesType,
    form:
      | "singular"
      | "plural"
      | "genitive"
      | "genitiveSingular"
      | "accusativeSingular",
  ) => g(`spaces.types.${type}.${form}` as Parameters<typeof g>[0]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Upleveling state
  const [newParents, setNewParents] = useState<NewParent[]>([]);
  const [assignments, setAssignments] = useState<Record<string, string | null>>(
    {},
  );

  const isUpleveling = HIERARCHY[newType] < HIERARCHY[currentType];
  // intermediateType exists only for skip-level upleveling (room → area)
  const intermediateType: SpacesType | null =
    HIERARCHY[newType] + 1 < HIERARCHY[currentType]
      ? TYPES_BY_LEVEL[HIERARCHY[newType] + 1]
      : null;

  const existingRoots = allSpaces.filter(
    (s) => !getParentId(s) && s.type === currentType,
  );
  const spacesToBecomeRoots = allSpaces.filter((s) => s.type === newType);
  // Only archive spaces at levels above the new root — children of the new roots stay intact
  const spacesToArchive = allSpaces.filter(
    (s) => HIERARCHY[s.type] < HIERARCHY[newType],
  );

  const hasExistingSpaces = allSpaces.length > 0;

  // newIntermediates: new spaces at the intermediate level (e.g. buildings when going room → area)
  const [newIntermediates, setNewIntermediates] = useState<NewIntermediate[]>(
    [],
  );

  function handleClose() {
    if (isSaving) return;
    setNewParents([]);
    setNewIntermediates([]);
    setAssignments({});
    setSaveError(null);
    onClose();
  }

  function addNewParent() {
    setNewParents((prev) => [
      ...prev,
      { tempId: crypto.randomUUID(), name: "" },
    ]);
  }

  function updateNewParentName(tempId: string, name: string) {
    setNewParents((prev) =>
      prev.map((p) => (p.tempId === tempId ? { ...p, name } : p)),
    );
  }

  function removeNewParent(tempId: string) {
    setNewParents((prev) => prev.filter((p) => p.tempId !== tempId));
    // clear intermediate assignments that pointed to this parent
    setNewIntermediates((prev) =>
      prev.map((p) =>
        p.parentTempId === tempId ? { ...p, parentTempId: null } : p,
      ),
    );
  }

  function addNewIntermediate() {
    setNewIntermediates((prev) => [
      ...prev,
      { tempId: crypto.randomUUID(), name: "", parentTempId: null },
    ]);
  }

  function updateNewIntermediateName(tempId: string, name: string) {
    setNewIntermediates((prev) =>
      prev.map((p) => (p.tempId === tempId ? { ...p, name } : p)),
    );
  }

  function removeNewIntermediate(tempId: string) {
    setNewIntermediates((prev) => prev.filter((p) => p.tempId !== tempId));
    setAssignments((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        if (next[key] === tempId) next[key] = null;
      }
      return next;
    });
  }

  function assignIntermediateParent(
    intermediateTempId: string,
    parentTempId: string | null,
  ) {
    setNewIntermediates((prev) =>
      prev.map((p) =>
        p.tempId === intermediateTempId ? { ...p, parentTempId } : p,
      ),
    );
  }

  function assignSpace(spaceId: string, parentTempId: string | null) {
    setAssignments((prev) => ({ ...prev, [spaceId]: parentTempId }));
  }

  const allAssigned =
    existingRoots.length > 0 &&
    existingRoots.every((s) => assignments[s.id] != null);
  const allParentsNamed =
    newParents.length > 0 && newParents.every((p) => p.name.trim().length > 0);
  const allIntermediatesValid =
    newIntermediates.length > 0 &&
    newIntermediates.every(
      (p) => p.name.trim().length > 0 && p.parentTempId != null,
    );

  const canSaveUpleveling = intermediateType
    ? allParentsNamed && allIntermediatesValid && allAssigned
    : allParentsNamed && allAssigned;

  async function handleSaveUpleveling() {
    setIsSaving(true);
    setSaveError(null);
    try {
      const createdTopParents = await Promise.all(
        newParents.map((p) =>
          createSpace({
            name: p.name.trim(),
            type: newType,
            listing: listingId,
          }),
        ),
      );
      const topIdMap = new Map(
        newParents.map((p, i) => [p.tempId, createdTopParents[i].doc.id]),
      );

      if (intermediateType) {
        // skip-level: create intermediates first, then assign existing spaces to them
        const createdIntermediates = await Promise.all(
          newIntermediates.map((p) =>
            createSpace({
              name: p.name.trim(),
              type: intermediateType,
              listing: listingId,
              parent: p.parentTempId
                ? (topIdMap.get(p.parentTempId) ?? null)
                : null,
            }),
          ),
        );
        const intermediateIdMap = new Map(
          newIntermediates.map((p, i) => [
            p.tempId,
            createdIntermediates[i].doc.id,
          ]),
        );

        await Promise.all(
          existingRoots.map((s) => {
            const parentTempId = assignments[s.id];
            const realParentId = parentTempId
              ? intermediateIdMap.get(parentTempId)
              : undefined;
            return updateSpace(s.id, { parent: realParentId ?? null });
          }),
        );
      } else {
        // direct upleveling: assign existing spaces to top parents
        await Promise.all(
          existingRoots.map((s) => {
            const parentTempId = assignments[s.id];
            const realParentId = parentTempId
              ? topIdMap.get(parentTempId)
              : undefined;
            return updateSpace(s.id, { parent: realParentId ?? null });
          }),
        );
      }

      await saveListingDetail({
        id: venueDetailId,
        data: { spacesType: newType },
      });

      queryClient.invalidateQueries({
        queryKey: spaceKeys.byListing(listingId),
      });

      setNewParents([]);
      setNewIntermediates([]);
      setAssignments({});
      onSuccess();
    } catch {
      setSaveError(t("saveError"));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSaveDownleveling() {
    setIsSaving(true);
    setSaveError(null);
    try {
      await Promise.all(
        spacesToBecomeRoots.map((s) => updateSpace(s.id, { parent: null })),
      );
      await Promise.all(
        spacesToArchive.map((s) => updateSpace(s.id, { status: "archived" })),
      );

      await saveListingDetail({
        id: venueDetailId,
        data: { spacesType: newType },
      });

      queryClient.invalidateQueries({
        queryKey: spaceKeys.byListing(listingId),
      });

      onSuccess();
    } catch {
      setSaveError(t("saveError"));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSaveSimple() {
    setIsSaving(true);
    setSaveError(null);
    try {
      await saveListingDetail({
        id: venueDetailId,
        data: { spacesType: newType },
      });
      onSuccess();
    } catch {
      setSaveError(t("saveError"));
    } finally {
      setIsSaving(false);
    }
  }

  if (!isOpen) return null;

  // No existing spaces — simple confirmation
  if (!hasExistingSpaces) {
    return (
      <ModalLayout
        isOpen={isOpen}
        header={t("noSpaces.header")}
        onClose={handleClose}
        disableClose={isSaving}
        errorMessage={saveError ?? undefined}
        maxWidth="max-w-md"
      >
        <Text variant="body" color="textLight" as="p">
          {t.rich("noSpaces.description", {
            type: gl(newType, "plural"),
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </Text>
        <div className="flex justify-end gap-3 mt-6">
          <Button
            text={t("noSpaces.cancel")}
            version="plain"
            onClick={handleClose}
            disabled={isSaving}
          />
          <Button
            text={t("noSpaces.confirm")}
            version="primary"
            onClick={handleSaveSimple}
            disabled={isSaving}
          />
        </div>
      </ModalLayout>
    );
  }

  if (isUpleveling) {
    const namedParents = newParents.filter((p) => p.name.trim().length > 0);
    const namedAndAssignedIntermediates = newIntermediates.filter(
      (p) => p.name.trim().length > 0 && p.parentTempId != null,
    );

    return (
      <ModalLayout
        isOpen={isOpen}
        header={t("upleveling.header", { type: gl(newType, "plural") })}
        onClose={handleClose}
        disableClose={isSaving}
        errorMessage={saveError ?? undefined}
      >
        {/* Section 1: Create top-level parents */}
        <div className="mb-6">
          <Text
            variant="label-lg"
            color="textDark"
            className="font-semibold mb-1"
          >
            {t("upleveling.createTitle", { type: gl(newType, "plural") })}
          </Text>
          <Text variant="label" color="textLight" as="p" className="mb-3">
            {intermediateType
              ? t("upleveling.createDescriptionSkipLevel", {
                  newType: gl(newType, "plural"),
                  intermediateType: gl(intermediateType, "plural"),
                })
              : t("upleveling.createDescription", {
                  currentType: gl(currentType, "plural"),
                  newTypeGenitive: gl(newType, "genitive"),
                })}
          </Text>

          <div className="flex flex-col gap-2">
            {newParents.map((parent) => (
              <div key={parent.tempId} className="flex items-center gap-2">
                <div className="flex-1">
                  <Input
                    inputProps={{
                      value: parent.name,
                      onChange: (e) =>
                        updateNewParentName(parent.tempId, e.target.value),
                      placeholder: t("upleveling.namePlaceholder", {
                        type: gl(newType, "genitiveSingular"),
                      }),
                      disabled: isSaving,
                    }}
                  />
                </div>
                <button
                  onClick={() => removeNewParent(parent.tempId)}
                  disabled={isSaving}
                  className="p-2 text-zinc-400 hover:text-danger transition-colors disabled:opacity-40"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addNewParent}
            disabled={isSaving}
            className="mt-2 flex items-center gap-2 hover:opacity-70 transition-opacity disabled:opacity-40"
          >
            <Plus className="w-4 h-4 text-zinc-500" />
            <Text as="span" variant="label" color="textLight">
              {t("upleveling.addButton", {
                type: gl(newType, "accusativeSingular"),
              })}
            </Text>
          </button>
        </div>

        {/* Section 2 (skip-level only): Create intermediate parents */}
        {intermediateType && namedParents.length > 0 && (
          <div className="border-t border-zinc-100 pt-5 mb-6">
            <Text
              variant="label-lg"
              color="textDark"
              className="font-semibold mb-1"
            >
              {t("upleveling.intermediateCreateTitle", {
                type: gl(intermediateType, "plural"),
                parentType: gl(newType, "genitive"),
              })}
            </Text>
            <Text variant="label" color="textLight" as="p" className="mb-3">
              {t("upleveling.intermediateCreateDescription", {
                type: gl(intermediateType, "accusativeSingular"),
                parentType: gl(newType, "genitiveSingular"),
              })}
            </Text>

            <div className="flex flex-col gap-2">
              {newIntermediates.map((item) => (
                <div
                  key={item.tempId}
                  className="grid grid-cols-2 items-center gap-2"
                >
                  <div className="flex-1">
                    <Input
                      inputProps={{
                        value: item.name,
                        onChange: (e) =>
                          updateNewIntermediateName(
                            item.tempId,
                            e.target.value,
                          ),
                        placeholder: t("upleveling.namePlaceholder", {
                          type: gl(intermediateType, "genitiveSingular"),
                        }),
                        disabled: isSaving,
                      }}
                    />
                  </div>
                  <div className="flex w-full gap-2">
                    <div className="w-full">
                      <SelectInput
                        value={item.parentTempId ?? ""}
                        onChange={(e) =>
                          assignIntermediateParent(
                            item.tempId,
                            e.target.value || null,
                          )
                        }
                        disabled={isSaving}
                        placeholder={t("upleveling.selectPlaceholder", {
                          type: gl(newType, "singular"),
                        })}
                        items={namedParents.map((p) => ({
                          value: p.tempId,
                          label: p.name,
                        }))}
                      />
                    </div>
                    <button
                      onClick={() => removeNewIntermediate(item.tempId)}
                      disabled={isSaving}
                      className="p-2 text-zinc-400 hover:text-danger transition-colors disabled:opacity-40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addNewIntermediate}
              disabled={isSaving}
              className="mt-2 flex items-center gap-2 hover:opacity-70 transition-opacity disabled:opacity-40"
            >
              <Plus className="w-4 h-4 text-zinc-500" />
              <Text as="span" variant="label" color="textLight">
                {t("upleveling.addButton", {
                  type: gl(intermediateType, "accusativeSingular"),
                })}
              </Text>
            </button>
          </div>
        )}

        {/* Section 3: Assign existing spaces to their immediate parents */}
        {existingRoots.length > 0 &&
          (intermediateType
            ? namedAndAssignedIntermediates.length > 0
            : namedParents.length > 0) && (
            <div className="border-t border-zinc-100 pt-5">
              <Text
                variant="label-lg"
                color="textDark"
                className="font-semibold mb-1"
              >
                {t("upleveling.assignTitle", {
                  currentType: gl(currentType, "plural"),
                })}
              </Text>
              <Text variant="label" color="textLight" as="p" className="mb-3">
                {t("upleveling.assignDescription", {
                  currentType: gl(currentType, "accusativeSingular"),
                  newType: intermediateType
                    ? gl(intermediateType, "genitiveSingular")
                    : gl(newType, "genitiveSingular"),
                })}
              </Text>

              <div className="flex flex-col gap-2">
                {existingRoots.map((space) => (
                  <div
                    key={space.id}
                    className="grid grid-cols-2 items-center gap-3"
                  >
                    <Text
                      variant="label"
                      color="textDark"
                      className="flex-1 truncate"
                    >
                      {space.name}
                    </Text>
                    <SelectInput
                      value={assignments[space.id] ?? ""}
                      onChange={(e) =>
                        assignSpace(space.id, e.target.value || null)
                      }
                      disabled={isSaving}
                      placeholder={t("upleveling.selectPlaceholder", {
                        type: intermediateType
                          ? gl(intermediateType, "singular")
                          : gl(newType, "singular"),
                      })}
                      items={(intermediateType
                        ? namedAndAssignedIntermediates
                        : namedParents
                      ).map((p) => ({ value: p.tempId, label: p.name }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-100">
          <Button
            text={t("upleveling.cancel")}
            version="plain"
            onClick={handleClose}
            disabled={isSaving}
          />
          <Button
            text={t("upleveling.save")}
            version="spaceFull"
            onClick={handleSaveUpleveling}
            disabled={!canSaveUpleveling || isSaving}
          />
        </div>
      </ModalLayout>
    );
  }

  // Downleveling
  return (
    <ModalLayout
      isOpen={isOpen}
      header={t("downleveling.header", { type: gl(newType, "plural") })}
      onClose={handleClose}
      disableClose={isSaving}
      errorMessage={saveError ?? undefined}
    >
      {spacesToBecomeRoots.length > 0 && (
        <div className="mb-5">
          <Text
            variant="label-lg"
            color="textDark"
            className="font-semibold mb-2"
          >
            {t("downleveling.becomeRootsTitle", {
              type: gl(newType, "plural"),
            })}
          </Text>
          <ul className="flex flex-col gap-1">
            {spacesToBecomeRoots.map((s) => (
              <li key={s.id} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-space shrink-0" />
                <Text as="span" variant="label" color="textDark">
                  {s.name}
                </Text>
              </li>
            ))}
          </ul>
        </div>
      )}

      {spacesToArchive.length > 0 && (
        <div className="p-4 rounded-xl bg-warning-surface border border-warning/20 mb-2">
          <Text
            variant="label-lg"
            className="font-semibold text-warning-dark mb-2"
          >
            {t("downleveling.archiveTitle")}
          </Text>
          <ul className="flex flex-col gap-1">
            {spacesToArchive.map((s) => (
              <li key={s.id} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-warning shrink-0" />
                <Text as="span" variant="label" color="textDark">
                  {s.name}
                </Text>
                <Text as="span" variant="caption" color="textLight">
                  ({gl(s.type, "singular")})
                </Text>
              </li>
            ))}
          </ul>
        </div>
      )}

      {spacesToBecomeRoots.length === 0 && (
        <Text variant="body" color="textLight" as="p" className="mb-2">
          {t.rich("downleveling.noRootsDescription", {
            type: gl(newType, "plural"),
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </Text>
      )}

      <div className="flex justify-end gap-3 mt-6">
        <Button
          text={t("downleveling.cancel")}
          version="plain"
          onClick={handleClose}
          disabled={isSaving}
        />
        <Button
          text={t("downleveling.confirm")}
          version="warningFull"
          onClick={handleSaveDownleveling}
          disabled={isSaving}
        />
      </div>
    </ModalLayout>
  );
}
